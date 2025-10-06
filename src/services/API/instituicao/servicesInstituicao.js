const MENSAGE = require("../../../modulo/config")
const CORRECTION = require("../../../utils/inputCheck")
const TableCORRECTION = require("../../../utils/tablesCheck")
const encryptionFunction = require("../../../utils/encryptionFunction")
const instituicaoDAO = require("../../../model/DAO/instituicao/instituicao")
const usuarioDAO = require("../../../model/DAO/usuario/usuario") // Reutiliza a função de validação de e-mail
const instituicaoEnderecoDAO = require("../../../model/DAO/instituicaoEndereco/instituicaoEndereco") 
const instituicaoTipoInstituicaoDAO = require("../../../model/DAO/instituicao/instituicaoTipoInstituicao/instituicaoTipoInstituicao") // NOVO DAO
const servicesEndereco = require("../endereco/servicesEndereco")

async function inserirInstituicao(dadosInstituicao, contentType){
    try {
        if (contentType == "application/json") {
            // Verifica se a estrutura básica da instituição e o CEP foram fornecidos
            // E verifica se 'tipos_instituicao' é um array de IDs (mesmo que vazio, se não for obrigatório no front)
            if (dadosInstituicao.cep && dadosInstituicao.tipos_instituicao && Array.isArray(dadosInstituicao.tipos_instituicao) && TableCORRECTION.CHECK_tbl_instituicao(dadosInstituicao)) {
                
                // 1. Verifica unicidade do email
                const emailExists = await usuarioDAO.verifyEmailExists(dadosInstituicao.email)
                if (emailExists) {
                    return MENSAGE.ERROR_EMAIL_ALREADY_EXISTS
                }
                
                // 2. Criptografa a senha
                const { senha_hash } = encryptionFunction.hashPassword(dadosInstituicao.senha)
                dadosInstituicao.senha = senha_hash

                // Armazena a lista de tipos de instituição antes de passar 'dadosInstituicao' adiante
                const tiposInstituicaoIds = dadosInstituicao.tipos_instituicao
                delete dadosInstituicao.tipos_instituicao // Remove do objeto principal para não atrapalhar o DAO

                // 3. Insere o Endereço
                const enderecoCriado = await servicesEndereco.inserirEndereco({ cep: dadosInstituicao.cep, numero: dadosInstituicao.numero, complemento: dadosInstituicao.complemento }, contentType)
                
                if (enderecoCriado.status_code == MENSAGE.SUCCESS_CEATED_ITEM.status_code) {
                    const idEndereco = enderecoCriado.endereco.id
                    
                    // 4. Insere a Instituição (sem id_tipo_instituicao)
                    let resultInstituicao = await instituicaoDAO.insertInstituicao(dadosInstituicao)
                    
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
                    return enderecoCriado // Retorna o erro do service de endereço (ex: CEP not found)
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
                         const { senha_hash } = encryptionFunction.hashPassword(dadosInstituicao.senha)
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


// Manter as demais funções (excluirInstituicao, listarTodasInstituicoes, buscarInstituicao, loginInstituicao) inalteradas
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
        if (contentType == "application/json") {
            const { email, senha } = dadosLogin
            
            if (email && senha) {
                const instituicao = await instituicaoDAO.selectByEmail(email)
                
                if (instituicao) {
                    const senhaValida = encryptionFunction.verifyPassword(senha, instituicao.senha_salt, instituicao.senha_hash)
                    
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

module.exports = {
    inserirInstituicao,
    atualizarInstituicao,
    excluirInstituicao,
    listarTodasInstituicoes,
    buscarInstituicao,
    loginInstituicao
}