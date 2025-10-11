const MENSAGE = require("../../../modulo/config")
const CORRECTION = require("../../../utils/inputCheck")
const TableCORRECTION = require("../../../utils/tablesCheck")
const encryptionFunction = require("../../../utils/encryptionFunction")
const instituicaoDAO = require("../../../model/DAO/instituicao/instituicao")
const usuarioDAO = require("../../../model/DAO/usuario/usuario")
const instituicaoEnderecoDAO = require("../../../model/DAO/instituicao/instituicaoEndereco/instituicaoEndereco") 
const instituicaoTipoInstituicaoDAO = require("../../../model/DAO/instituicao/instituicaoTipoInstituicao/instituicaoTipoInstituicao") 
const servicesEndereco = require("../endereco/servicesEndereco")

async function inserirInstituicao(dadosInstituicao, contentType){
    try { 
        // console.log("-"+contentType+"-");
        // console.log(contentType == "application/json", contentType == "application/json; charset=UTF-8");
               
        if (contentType == "application/json") {
            
            if (
                dadosInstituicao.cep && 
                dadosInstituicao.tipos_instituicao && 
                Array.isArray(dadosInstituicao.tipos_instituicao) && 
                TableCORRECTION.CHECK_tbl_instituicao(dadosInstituicao)
            ) {
                
                const emailExists = await usuarioDAO.verifyEmailExists(dadosInstituicao.email)
                if (emailExists) {
                    return MENSAGE.ERROR_EMAIL_ALREADY_EXISTS
                }

                const senha_hash = encryptionFunction.hashPassword(dadosInstituicao.senha)
                dadosInstituicao.senha = senha_hash
                
                const tiposInstituicaoIds = dadosInstituicao.tipos_instituicao
                delete dadosInstituicao.tipos_instituicao

                // console.log(dadosInstituicao);
                let endereco = { 
                    cep: dadosInstituicao.cep, 
                    numero: dadosInstituicao.numero, 
                    complemento: dadosInstituicao.complemento,
                    cidade: dadosInstituicao.cidade,
                    bairro: dadosInstituicao.bairro,
                    logradouro: dadosInstituicao.logradouro,
                    estado: dadosInstituicao.estado,
                }
                
                const enderecoCriado = await servicesEndereco.inserirEndereco(endereco, contentType)
                // console.log(enderecoCriado);
                
                if (enderecoCriado.status_code == MENSAGE.SUCCESS_CEATED_ITEM.status_code) {
                    const idEndereco = enderecoCriado.endereco.id
                    
                    // 4. Insere a Instituição (sem id_tipo_instituicao)
                    let resultInstituicao = await instituicaoDAO.insertInstituicao(dadosInstituicao, enderecoCriado.endereco.id)
                    
                    if (resultInstituicao) {
                        const idInstituicao = resultInstituicao.id

                        // 5. Cria a relação Instituicao-Endereco
                        const dadosRelacaoEndereco = { id_instituicao: idInstituicao, id_endereco: idEndereco }
                        const resultRelacaoEndereco = await instituicaoEnderecoDAO.insertInstituicaoEndereco(dadosRelacaoEndereco)

                        if (resultRelacaoEndereco) {
                            
                            // 6. Cria as relações Instituicao-TipoInstituicao (N:N)
                            let relacoesCriadas = true
                            if (tiposInstituicaoIds.length > 0) {
                                for (const idTipo of tiposInstituicaoIds) {
                                    const dadosRelacaoTipo = { id_instituicao: idInstituicao, id_tipo_instituicao: idTipo }
                                    const resultRelacaoTipo = await instituicaoTipoInstituicaoDAO.insertInstituicaoTipoInstituicao(dadosRelacaoTipo)
                                    if (!resultRelacaoTipo) {
                                        relacoesCriadas = false
                                        break // Se uma falhar, para o loop
                                    }
                                }
                            }
                            console.log(relacoesCriadas);
                            
                            if (relacoesCriadas) {
                                // SUCESSO TOTAL
                                return {
                                    ...MENSAGE.SUCCESS_CEATED_ITEM,
                                    instituicao: resultInstituicao
                                }
                            } else {
                                // ROLLBACK: Se a relação TIPO falhar, deleta a instituição e o endereço (se necessário)
                                await instituicaoDAO.deleteInstituicao(idInstituicao) 
                                await servicesEndereco.excluirEndereco(idEndereco) // Se necessário, pois deleteInstituicao deveria cuidar do endereço
                                return MENSAGE.ERROR_INTERNAL_SERVER_MODEL
                            }
                        } else {
                            // ROLLBACK: Se a relação ENDERECO falhar, deleta a instituição criada
                            await instituicaoDAO.deleteInstituicao(idInstituicao) 
                            return MENSAGE.ERROR_INTERNAL_SERVER_MODEL
                        }
                    } else {
                        // ROLLBACK: Se a instituição falhar, deleta o endereço criado
                        await servicesEndereco.excluirEndereco(idEndereco)
                        return MENSAGE.ERROR_INTERNAL_SERVER_MODEL
                    }
                } else {
                    return enderecoCriado 
                }
            } else {
                return MENSAGE.ERROR_REQUIRED_FIELDS
            }
        } else {
            console.log('oi');
            
            return MENSAGE.ERROR_CONTENT_TYPE
        }
    } catch (error) {
        console.error(error)
        return MENSAGE.ERROR_INTERNAL_SERVER_SERVICES
    }
}


async function atualizarInstituicao(dadosInstituicao, id, contentType){
    try {
        if (contentType == "application/json") {
            // Nota: Se 'tipos_instituicao' for enviado aqui, ele deve ser removido antes de chamar o DAO principal
            if (dadosInstituicao.tipos_instituicao) {
                delete dadosInstituicao.tipos_instituicao 
                // Assumimos que a atualização dos tipos de instituição é feita em um endpoint separado,
                // ou que o código de atualização do tipo de instituição será adicionado aqui, 
                // o que o torna complexo (requer exclusão e reinserção dos relacionamentos)
            }


            if (TableCORRECTION.CHECK_tbl_instituicao(dadosInstituicao) && CORRECTION.CHECK_ID(id)) {
                
                let resultSearch = await buscarInstituicao(parseInt(id))
                
                if (resultSearch.status_code == MENSAGE.SUCCESS_REQUEST.status_code) {
                    
                    const instituicaoExistente = resultSearch.instituicao
                    
                    // 1. Verifica se o email foi alterado e se o novo email já existe
                    if (dadosInstituicao.email && dadosInstituicao.email !== instituicaoExistente.email) {
                        const emailExists = await usuarioDAO.verifyEmailExists(dadosInstituicao.email)
                        if (emailExists) {
                            return MENSAGE.ERROR_EMAIL_ALREADY_EXISTS
                        }
                    }

                    // 2. Criptografa a senha (só se a senha for passada)
                    if(dadosInstituicao.senha){
                         const senha_hash = encryptionFunction.hashPassword(dadosInstituicao.senha)
                         dadosInstituicao.senha = senha_hash
                    } else {
                         // Se a senha não for passada, garantimos que ela não vá para o DAO update (partial update)
                         delete dadosInstituicao.senha
                    }
                    
                    // 3. Atualiza a Instituição
                    dadosInstituicao.id = parseInt(id)
                    // Uso de spread operator para garantir que apenas os campos do 'dadosInstituicao' sejam enviados
                    let result = await instituicaoDAO.updateInstituicao(dadosInstituicao)
                    
                    return result ? MENSAGE.SUCCESS_UPDATED_ITEM : MENSAGE.ERROR_INTERNAL_SERVER_MODEL
                } else if (resultSearch.status_code == MENSAGE.ERROR_NOT_FOUND.status_code) {
                    return MENSAGE.ERROR_NOT_FOUND
                } else {
                    return MENSAGE.ERROR_INTERNAL_SERVER_SERVICES
                }
            } else {
                return MENSAGE.ERROR_REQUIRED_FIELDS
            }
        } else {
            return MENSAGE.ERROR_CONTENT_TYPE
        }
    } catch (error) {
        console.error(error)
        return MENSAGE.ERROR_INTERNAL_SERVER_SERVICES
    }
}

async function excluirInstituicao(id){
    try {
        if (CORRECTION.CHECK_ID(id)) {
            let resultSearch = await buscarInstituicao(parseInt(id))
            
            if (resultSearch.status_code == MENSAGE.SUCCESS_REQUEST.status_code) {
                // OBS: Como tbl_instituicao_tipo_instituicao tem CASCADE ON DELETE com tbl_instituicao,
                // a exclusão da instituição principal deleta automaticamente os seus tipos.
                
                let result = await instituicaoDAO.deleteInstituicao(parseInt(id))
                return result ? MENSAGE.SUCCESS_DELETE_ITEM : MENSAGE.ERROR_NOT_DELETE
            } else if (resultSearch.status_code == MENSAGE.ERROR_NOT_FOUND.status_code) {
                return MENSAGE.ERROR_NOT_FOUND
            } else {
                return MENSAGE.ERROR_INTERNAL_SERVER_SERVICES
            }
        } else {
            return MENSAGE.ERROR_REQUIRED_FIELDS
        }
    } catch (error) {
        console.error(error)
        return MENSAGE.ERROR_INTERNAL_SERVER_SERVICES
    }
}

async function listarTodasInstituicoes(){
    try {
        let result = await instituicaoDAO.selectAllInstituicoes()
        if (result) {
            return result.length > 0 ? { ...MENSAGE.SUCCESS_REQUEST, instituicoes: result } : MENSAGE.ERROR_NOT_FOUND
        } else {
            return MENSAGE.ERROR_INTERNAL_SERVER_MODEL
        }
    } catch (error) {
        console.error(error)
        return MENSAGE.ERROR_INTERNAL_SERVER_SERVICES
    }
}

async function buscarInstituicao(id){
    try {
        if (CORRECTION.CHECK_ID(id)) {
            let result = await instituicaoDAO.selectByIdInstituicao(parseInt(id))
            return result ? { ...MENSAGE.SUCCESS_REQUEST, instituicao: result } : MENSAGE.ERROR_NOT_FOUND
        } else {
            return MENSAGE.ERROR_REQUIRED_FIELDS
        }
    } catch (error) {
        console.error(error)
        return MENSAGE.ERROR_INTERNAL_SERVER_SERVICES
    }
}

async function loginInstituicao(dadosLogin, contentType){
    try {
        console.log(dadosLogin);
        
        if (contentType == "application/json") {
            const { email, senha } = dadosLogin
            // console.log(email && senha);
            
            if (email && senha) {
                const instituicao = await instituicaoDAO.selectByEmail(email)
                // console.log(senha, instituicao.senha);
                
                
                if (instituicao) {
                    const senhaValida = encryptionFunction.verifyPassword(senha, instituicao.senha)
                    
                    if (senhaValida) {
                        delete instituicao.senha
                        return {
                            ...MENSAGE.SUCCESS_LOGIN,
                            instituicao: instituicao
                        }
                    } else {
                        return MENSAGE.ERROR_INVALID_CREDENTIALS
                    }
                } else {
                    return MENSAGE.ERROR_INVALID_CREDENTIALS
                }
            } else {
                return MENSAGE.ERROR_REQUIRED_FIELDS
            }
        } else {
            return MENSAGE.ERROR_CONTENT_TYPE
        }
    } catch (error) {
        console.error(error)
        return MENSAGE.ERROR_INTERNAL_SERVER_SERVICES
    }
}

async function buscarInstituicoesPorNome(params) {
    try {
        const nomeBusca = params.nome || null
        const pagina = params.pagina || 1
        const tamanho = params.tamanho || 20

        if (!CORRECTION.CHECK_ID(pagina) || !CORRECTION.CHECK_ID(tamanho)) {
            return MENSAGE.ERROR_INVALID_PARAM
        }

        const resultDAO = await instituicaoDAO.selectSearchInstituicoesByNome(nomeBusca, pagina, tamanho)

        if (!resultDAO) {
            return MENSAGE.ERROR_INTERNAL_SERVER_MODEL
        }

        const { instituicoes, total } = resultDAO
        const tamanhoInt = parseInt(tamanho)
        const paginaAtualInt = parseInt(pagina)
        const totalPaginas = Math.ceil(total / tamanhoInt)

        if (instituicoes.length === 0) {
            return MENSAGE.ERROR_NOT_FOUND
        }

        // --- Lógica de URL para a Próxima Página ---
        let nextUrl = null
        if (paginaAtualInt < totalPaginas) {
            const nextPage = paginaAtualInt + 1
            
            const queryParams = new URLSearchParams()
            
            // Adiciona a busca (se existir)
            if (nomeBusca) {
                queryParams.append('busca', nomeBusca)
            }
            // Adiciona o tamanho (se for diferente do padrão 20)
            if (tamanhoInt !== 20) {
                 queryParams.append('tamanho', tamanhoInt.toString())
            }
            
            // Adiciona o número da próxima página
            queryParams.append('pagina', nextPage.toString())

            let nextUrl = null
            if (paginaAtualInt < totalPaginas) {
                const nextParams = new URLSearchParams(queryParams.toString()) // Copia os parâmetros base
                nextParams.append('pagina', (paginaAtualInt + 1).toString())
                nextUrl = `${MENSAGE.API_BASE_URL}/v1/oportunyfam/instituicoes?${queryParams.toString()}`
            }

            let prevUrl = null
            if (paginaAtualInt > 1) {
                const prevParams = new URLSearchParams(queryParams.toString()) // Copia os parâmetros base
                prevParams.append('pagina', (paginaAtualInt - 1).toString())
                prevUrl = `${baseUrlPath}?${prevParams.toString()}`
            }
        }
        
        // Retorno formatado
        return {
            ...MENSAGE.SUCCESS_REQUEST,
            metadata: {
                pagina_atual: paginaAtualInt,
                tamanho_pagina: tamanhoInt,
                total_registros: total,
                total_paginas: totalPaginas,
                link_proxima_pagina: nextUrl,
                link_pagina_anterior: prevUrl
            },
            instituicoes: instituicoes
        }

    } catch (error) {
        console.error(error)
        return MENSAGE.ERROR_INTERNAL_SERVER_SERVICES
    }
}


module.exports = {
    inserirInstituicao,
    atualizarInstituicao,
    excluirInstituicao,
    listarTodasInstituicoes,
    buscarInstituicao,
    loginInstituicao,
    buscarInstituicoesPorNome
}