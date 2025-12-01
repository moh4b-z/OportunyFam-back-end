const MENSAGE = require("../../../modulo/config")
const CORRECTION = require("../../../utils/inputCheck")
const TableCORRECTION = require("../../../utils/tablesCheck")
const encryptionFunction = require("../../../utils/encryptionFunction")
const instituicaoDAO = require("../../../model/DAO/instituicao/instituicao")
const loginDAO = require("../../../model/DAO/login")
const instituicaoTipoInstituicaoDAO = require("../../../model/DAO/instituicao/instituicaoTipoInstituicao/instituicaoTipoInstituicao") 
const servicesEndereco = require("../endereco/servicesEndereco")
const { URLSearchParams } = require('url'); // Adicionado para garantir a URLSearchParams

/**
 * Insere uma nova instituição, com endereço e tipos associados.
 */
async function inserirInstituicao(dadosInstituicao, contentType){
    // Variáveis para garantir o rollback
    let idEndereco = null;
    let idInstituicao = null;

    try { 
        if (contentType === "application/json" || contentType === "application/json; charset=UTF-8") {
            
            // 1. Validação de campos obrigatórios
            if (
                dadosInstituicao.cep && 
                dadosInstituicao.numero && // Adicionado 'numero' pois é crucial para o endereço
                dadosInstituicao.logradouro && // Adicionado 'logradouro' para ter um endereço completo
                dadosInstituicao.tipos_instituicao && 
                Array.isArray(dadosInstituicao.tipos_instituicao) && 
                TableCORRECTION.CHECK_tbl_instituicao(dadosInstituicao)
            ) {
                // 2. Verifica duplicações
                const emailExists = await loginDAO.verifyEmailExists(dadosInstituicao.email)
                if (emailExists) return MENSAGE.ERROR_EMAIL_ALREADY_EXISTS

                const cnpjExists = await loginDAO.verifyCNPJExists(dadosInstituicao.cnpj)
                if (cnpjExists) return MENSAGE.ERROR_CNPJ_ALREADY_EXISTS

                // 3. Criptografa a senha
                dadosInstituicao.senha = encryptionFunction.hashPassword(dadosInstituicao.senha)

                const tiposInstituicaoIds = dadosInstituicao.tipos_instituicao
                delete dadosInstituicao.tipos_instituicao

                // 4. Cria o endereço
                const enderecoData = { 
                    cep: dadosInstituicao.cep, 
                    numero: dadosInstituicao.numero, 
                    complemento: dadosInstituicao.complemento,
                    cidade: dadosInstituicao.cidade,
                    bairro: dadosInstituicao.bairro,
                    logradouro: dadosInstituicao.logradouro,
                    estado: dadosInstituicao.estado,
                    latitude: dadosInstituicao.latitude, // Supondo que você pode ter lat/lng
                    longitude: dadosInstituicao.longitude
                }
                
                // Excluir dados do endereço do objeto principal
                delete dadosInstituicao.cep
                delete dadosInstituicao.numero
                delete dadosInstituicao.complemento
                delete dadosInstituicao.cidade
                delete dadosInstituicao.bairro
                delete dadosInstituicao.logradouro
                delete dadosInstituicao.estado
                delete dadosInstituicao.latitude
                delete dadosInstituicao.longitude

                const enderecoCriado = await servicesEndereco.inserirEndereco(enderecoData, contentType)

                if (enderecoCriado.status_code === MENSAGE.SUCCESS_CEATED_ITEM.status_code) {
                    
                    idEndereco = enderecoCriado.endereco.id // Armazena o ID para rollback
                    dadosInstituicao.id_endereco = idEndereco
                    
                    // 5. Insere a instituição
                    const resultInstituicao = await instituicaoDAO.insertInstituicao(dadosInstituicao)
                    
                    // Se o DAO retornar o objeto completo, usamos o ID dele
                    if (resultInstituicao && resultInstituicao.instituicao_id) {
                        
                        idInstituicao = resultInstituicao.instituicao_id // Armazena o ID da instituição para uso/rollback
                        
                        // 6. Insere as relações de tipos
                        let relacoesCriadas = true
                        for (const idTipo of tiposInstituicaoIds) {
                            const dadosRelacaoTipo = { 
                                id_instituicao: idInstituicao, 
                                id_tipo_instituicao: idTipo 
                            }
                            
                            const resultRelacaoTipo = await instituicaoTipoInstituicaoDAO.insertInstituicaoTipoInstituicao(dadosRelacaoTipo)
                            
                            if (!resultRelacaoTipo) {
                                relacoesCriadas = false
                                break
                            }
                        }

                        if (relacoesCriadas) {
                            // 7. Sucesso total
                            return {
                                ...MENSAGE.SUCCESS_CEATED_ITEM,
                                instituicao: resultInstituicao
                            }
                        } else {
                            // 7b. Rollback das relações falhou
                            // O DAO de instituição deleta a pessoa (CASCADE) -> deleta a instituição
                            // Precisamos do ID da Pessoa para deletar, vamos buscar.
                            // Nota: A procedure de INSERT retorna o objeto completo que contem o pessoa_id
                            const pessoaId = resultInstituicao.pessoa_id
                            if(pessoaId) await instituicaoDAO.deleteInstituicao(pessoaId) 
                            await servicesEndereco.excluirEndereco(idEndereco)
                            return MENSAGE.ERROR_INTERNAL_SERVER_MODEL
                        }
                    } else {
                        // 5b. Rollback da instituição falhou
                        await servicesEndereco.excluirEndereco(idEndereco)
                        return MENSAGE.ERROR_INTERNAL_SERVER_MODEL
                    }

                } else {
                    // 4b. Endereço falhou
                    return enderecoCriado 
                }

            } else {
                return MENSAGE.ERROR_REQUIRED_FIELDS
            }
        } else {
            return MENSAGE.ERROR_CONTENT_TYPE
        }

    } catch (error) {
        console.error(error)
        // Tentativa de rollback geral em caso de falha não tratada
        if (idInstituicao) {
             // Tenta buscar o pessoa_id para o delete, se necessário.
             const instituicaoCompleta = await instituicaoDAO.selectByIdInstituicao(idInstituicao);
             if(instituicaoCompleta && instituicaoCompleta.pessoa_id) {
                await instituicaoDAO.deleteInstituicao(instituicaoCompleta.pessoa_id)
             }
        }
        if (idEndereco) await servicesEndereco.excluirEndereco(idEndereco)
        
        return MENSAGE.ERROR_INTERNAL_SERVER_SERVICES
    }
}

/**
 * Atualiza uma instituição (incluindo validações)
 * Assume que a atualização de endereço e tipos são feitas em endpoints separados ou o endereço é enviado
 * como dados parciais.
 */
async function atualizarInstituicao(dadosInstituicao, id, contentType){
    try {
        if (contentType === "application/json" || contentType === "application/json; charset=UTF-8") {
            
            // Verifica se o ID é válido e se a instituição existe
            if (CORRECTION.CHECK_ID(id)) {
                
                const idInstituicao = parseInt(id)
                dadosInstituicao.id = idInstituicao // Garante que o ID da instituição seja passado ao DAO
                
                // 1. Busca a instituição existente
                let resultSearch = await buscarInstituicao(idInstituicao)
                
                if (resultSearch.status_code === MENSAGE.SUCCESS_REQUEST.status_code) {
                    
                    const instituicaoExistente = resultSearch.instituicao
                    
                    // 2. Validações de unicidade (email e CNPJ)
                    if (dadosInstituicao.email && dadosInstituicao.email !== instituicaoExistente.email) {
                        const emailExists = await loginDAO.verifyEmailExists(dadosInstituicao.email)
                        if (emailExists) return MENSAGE.ERROR_EMAIL_ALREADY_EXISTS
                    }
                    if (dadosInstituicao.cnpj && dadosInstituicao.cnpj !== instituicaoExistente.cnpj) {
                        const cnpjExists = await loginDAO.verifyCNPJExists(dadosInstituicao.cnpj)
                        if (cnpjExists) return MENSAGE.ERROR_CNPJ_ALREADY_EXISTS
                    }

                    // 3. Lógica da senha
                    if(dadosInstituicao.senha){
                       dadosInstituicao.senha = encryptionFunction.hashPassword(dadosInstituicao.senha)
                    } else {
                       delete dadosInstituicao.senha
                    }
                    
                    if (dadosInstituicao.id_endereco !== undefined && dadosInstituicao.id_endereco !== null) {
                         if (!CORRECTION.CHECK_ID(dadosInstituicao.id_endereco)) {
                             return MENSAGE.ERROR_INVALID_ID_ADDRESS
                         }
                    }

                    // 5. Remove campos que não devem ser passados para o DAO (ex: tipos)
                    if (dadosInstituicao.tipos_instituicao) {
                        delete dadosInstituicao.tipos_instituicao
                    }
                    
                    // 6. Atualiza a Instituição
                    let result = await instituicaoDAO.updateInstituicao(dadosInstituicao)
                    
                    if (result) {
                        return {
                            ...MENSAGE.SUCCESS_UPDATED_ITEM,
                            instituicao: result
                        }
                    } else {
                        // 6b. Falha interna no DAO
                        return MENSAGE.ERROR_INTERNAL_SERVER_MODEL
                    }
                } else if (resultSearch.status_code === MENSAGE.ERROR_NOT_FOUND.status_code) {
                    // 1b. Instituição não encontrada
                    return MENSAGE.ERROR_NOT_FOUND
                } else {
                    // 1c. Erro na busca (erro de servidor no DAO)
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


// --- Funções de busca e exclusão (não alteradas) ---

async function excluirInstituicao(id){
    try {
        if (CORRECTION.CHECK_ID(id)) {
            let resultSearch = await buscarInstituicao(parseInt(id))
            
            
            if (resultSearch.status_code == MENSAGE.SUCCESS_REQUEST.status_code) {
                // OBS: A exclusão é feita pelo ID da PESSOA (pessoa_id)
                // O ON DELETE CASCADE em tbl_instituicao e a lógica no DAO se encarregam do restante.
                
                let result = await instituicaoDAO.deleteInstituicao(parseInt(resultSearch.instituicao.pessoa_id))
                
                if (result) {
                    return MENSAGE.SUCCESS_DELETE_ITEM
                } else {
                    // Falha na deleção no DAO
                    return MENSAGE.ERROR_INTERNAL_SERVER_MODEL
                }
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

async function buscarInstituicoesPorNome(params) {
    try {
        const nomeBusca = params.nome || null;
        
        // 1. CHAMA O DAO SEM OS PARÂMETROS DE PAGINAÇÃO
        // O DAO deve estar ajustado para ignorar paginação ou receber null.
        const resultDAO = await instituicaoDAO.selectSearchInstituicoesByNome(nomeBusca); 
        // Nota: A função DAO deve ser ajustada para aceitar apenas 'nomeBusca'
        
        if (!resultDAO) {
            return MENSAGE.ERROR_INTERNAL_SERVER_MODEL;
        }

        // Desestrutura o resultado (espera-se que 'total' seja o count real, não paginado)
        const { instituicoes } = resultDAO; 

        if (instituicoes.length === 0) {
            return MENSAGE.ERROR_NOT_FOUND;
        }
        
        // 2. RETORNO SIMPLES (Similar à buscarInstituicao(id))
        return { 
            ...MENSAGE.SUCCESS_REQUEST, 
            instituicoes: instituicoes 
        };

    } catch (error) {
        console.error(error);
        return MENSAGE.ERROR_INTERNAL_SERVER_SERVICES;
    }
}

async function buscarAlunosInstituicao(params) {
    try {        
        let instituicao_id = params.instituicao_id
        let atividade_id = params.atividade_id
        let status_id = params.status_id

        // Se foi fornecido atividade_id, o instituicao_id é obrigatório
        if (atividade_id && !instituicao_id) {
            return {
                ...MENSAGE.ERROR_REQUIRED_FIELDS,
                messagem: "Para filtrar por atividade, é necessário informar o ID da instituição"
            }
        }

        // Validar IDs se fornecidos
        if (instituicao_id && !CORRECTION.CHECK_ID(instituicao_id)) {
            return MENSAGE.ERROR_REQUIRED_FIELDS
        } else if (atividade_id && !CORRECTION.CHECK_ID(atividade_id)) {
            return MENSAGE.ERROR_REQUIRED_FIELDS
        } else if (status_id && !CORRECTION.CHECK_ID(status_id)) {
            return MENSAGE.ERROR_REQUIRED_FIELDS
        }

        const resultDAO = await instituicaoDAO.selectAlunosInstituicao({
            instituicao_id: instituicao_id ? parseInt(instituicao_id) : null,
            atividade_id: atividade_id ? parseInt(atividade_id) : null,
            status_id: status_id ? parseInt(status_id) : null
        })

        // fluxo padrão: if (success) { retorno de sucesso } else { erro }
        if (resultDAO) {
            if (resultDAO.length > 0) {
                return {
                    ...MENSAGE.SUCCESS_REQUEST,
                    alunos: resultDAO
                }
            } else {
                return MENSAGE.ERROR_NOT_FOUND
            }
        } else {
            return MENSAGE.ERROR_INTERNAL_SERVER_SERVICES
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
    buscarInstituicoesPorNome,
    buscarAlunosInstituicao
}