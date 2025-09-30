const MENSAGE = require("../../../modulo/config")
const CORRECTION = require("../../../utils/inputCheck")
const TableCORRECTION = require("../../../utils/tablesCheck")
const encryptionFunction = require("../../../utils/encryptionFunction")
const instituicaoDAO = require("../../../model/DAO/instituicao/instituicao")
const usuarioDAO = require("../../../model/DAO/usuario/usuario") // Reutiliza a função de validação de e-mail
const instituicaoEnderecoDAO = require("../../../model/DAO/instituicaoEndereco/instituicaoEndereco") // Caminho ajustado
const servicesEndereco = require("../endereco/servicesEndereco")

async function inserirInstituicao(dadosInstituicao, contentType){
    try {
        if (contentType == "application/json") {
            if (dadosInstituicao.cep && TableCORRECTION.CHECK_tbl_instituicao(dadosInstituicao)) {
                
                // 1. Verifica unicidade do email
                const emailExists = await usuarioDAO.verifyEmailExists(dadosInstituicao.email)
                if (emailExists) {
                    return MENSAGE.ERROR_EMAIL_ALREADY_EXISTS
                }
                
                // 2. Criptografa a senha
                const { senha_hash } = encryptionFunction.hashPassword(dadosInstituicao.senha)
                dadosInstituicao.senha = senha_hash

                // 3. Insere o Endereço
                const enderecoCriado = await servicesEndereco.inserirEndereco({ cep: dadosInstituicao.cep, numero: dadosInstituicao.numero, complemento: dadosInstituicao.complemento }, contentType)
                
                if (enderecoCriado.status_code == MENSAGE.SUCCESS_CEATED_ITEM.status_code) {
                    const idEndereco = enderecoCriado.endereco.id
                    
                    // 4. Insere a Instituição
                    let resultInstituicao = await instituicaoDAO.insertInstituicao(dadosInstituicao)
                    
                    if (resultInstituicao) {
                        const idInstituicao = resultInstituicao.id

                        // 5. Cria a relação Instituicao-Endereco
                        const dadosRelacao = { id_instituicao: idInstituicao, id_endereco: idEndereco }
                        const resultRelacao = await instituicaoEnderecoDAO.insertInstituicaoEndereco(dadosRelacao)

                        if (resultRelacao) {
                            return {
                                ...MENSAGE.SUCCESS_CEATED_ITEM,
                                instituicao: resultInstituicao
                            }
                        } else {
                            // ROLLBACK: Se a relação falhar, deleta a instituição criada
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

                    // 2. Criptografa a senha (sempre criptografa ao atualizar)
                    const { senha_hash } = encryptionFunction.hashPassword(dadosInstituicao.senha)
                    dadosInstituicao.senha = senha_hash
                    
                    // 3. Atualiza a Instituição
                    dadosInstituicao.id = parseInt(id)
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
                // OBS: O deleteInstituicao do DAO deve gerenciar a exclusão do Endereço relacionado, se necessário.
                // Como tbl_instituicao_endereco tem CASCADE ON DELETE, deletar a instituição
                // deleta a relação.

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