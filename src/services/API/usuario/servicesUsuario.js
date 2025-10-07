const MENSAGE = require("../../../modulo/config")
const CORRECTION = require("../../../utils/inputCheck")
const TableCORRECTION = require("../../../utils/tablesCheck")
const encryptionFunction = require("../../../utils/encryptionFunction")
const usuarioDAO = require("../../../model/DAO/usuario/usuario")
const usuarioEnderecoDAO = require("../../../model/DAO/usuario/usuarioEndereco/usuarioEndereco") 
const servicesEndereco = require("../endereco/servicesEndereco") 

async function inserirUsuario(dadosUsuario, contentType){
    try {
        if (contentType == "application/json") {
            // Validação básica do usuário (campos obrigatórios) e do CEP
            if (dadosUsuario.cep && TableCORRECTION.CHECK_tbl_usuario(dadosUsuario)) {
                
                // 1. Verifica unicidade do email
                const emailExists = await usuarioDAO.verifyEmailExists(dadosUsuario.email)
                if (emailExists) {
                    return MENSAGE.ERROR_EMAIL_ALREADY_EXISTS
                }
                
                // 2. Criptografa a senha
                const { senha_hash } = encryptionFunction.hashPassword(dadosUsuario.senha)
                dadosUsuario.senha = senha_hash

                // 3. Insere o Endereço (repassando dados para o service de Endereço)
                const dadosEnderecoParaInserir = { 
                    cep: dadosUsuario.cep,
                    numero: dadosUsuario.numero, // Repassando numero e complemento para o service
                    complemento: dadosUsuario.complemento
                }

                const enderecoCriado = await servicesEndereco.inserirEndereco(dadosEnderecoParaInserir, contentType)

                if (enderecoCriado.status_code == MENSAGE.SUCCESS_CEATED_ITEM.status_code) {
                    const idEndereco = enderecoCriado.endereco.id

                    // 4. Insere o Usuário
                    let resultUsuario = await usuarioDAO.insertUsuario(dadosUsuario)
                    
                    if (resultUsuario) {
                        const idUsuario = resultUsuario.id

                        // 5. Cria a relação Usuario-Endereco
                        const dadosRelacao = { id_usuario: idUsuario, id_endereco: idEndereco }
                        const resultRelacao = await usuarioEnderecoDAO.insertUsuarioEndereco(dadosRelacao)

                        if (resultRelacao) {
                            return {
                                ...MENSAGE.SUCCESS_CEATED_ITEM,
                                usuario: resultUsuario
                            }
                        } else {
                            // ROLLBACK: Se a relação falhar, deleta o usuário e o endereço
                            await usuarioDAO.deleteUsuario(idUsuario)
                            await servicesEndereco.excluirEndereco(idEndereco)
                            return MENSAGE.ERROR_INTERNAL_SERVER_MODEL
                        }
                    } else {
                        // ROLLBACK: Se o usuário falhar, deleta o endereço criado
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

async function atualizarUsuario(dadosUsuario, id, contentType){
    try {
        if (contentType == "application/json") {
            if (TableCORRECTION.CHECK_tbl_usuario(dadosUsuario) && CORRECTION.CHECK_ID(id)) {
                
                let resultSearch = await buscarUsuario(parseInt(id))
                
                if (resultSearch.status_code == MENSAGE.SUCCESS_REQUEST.status_code) {
                    
                    const usuarioExistente = resultSearch.usuario

                    // 1. Se o email for alterado, verifica se já existe
                    if (dadosUsuario.email && dadosUsuario.email !== usuarioExistente.email) {
                        const emailExists = await usuarioDAO.verifyEmailExists(dadosUsuario.email)
                        if (emailExists) {
                            return MENSAGE.ERROR_EMAIL_ALREADY_EXISTS
                        }
                    }

                    // 2. Criptografa a senha (sempre criptografa ao atualizar)
                    const { senha_hash } = encryptionFunction.hashPassword(dadosUsuario.senha)
                    dadosUsuario.senha = senha_hash
                    dadosUsuario.id = parseInt(id)

                    // 3. Atualiza o Usuário
                    let result = await usuarioDAO.updateUsuario(dadosUsuario)
                    
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

async function excluirUsuario(id){
    try {
        if (CORRECTION.CHECK_ID(id)) {
            let resultSearch = await buscarUsuario(parseInt(id))
            
            if (resultSearch.status_code == MENSAGE.SUCCESS_REQUEST.status_code) {
                // OBS: O deleteUsuario do DAO deve gerenciar a exclusão do Endereço relacionado, se necessário.
                // Como tbl_usuario_endereco tem CASCADE ON DELETE, deletar o usuário deleta a relação.

                let result = await usuarioDAO.deleteUsuario(parseInt(id))
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

async function listarTodosUsuarios(){
    try {
        let result = await usuarioDAO.selectAllUsuario()
        if (result) {
            return result.length > 0 ? { ...MENSAGE.SUCCESS_REQUEST, usuarios: result } : MENSAGE.ERROR_NOT_FOUND
        } else {
            return MENSAGE.ERROR_INTERNAL_SERVER_MODEL
        }
    } catch (error) {
        console.error(error)
        return MENSAGE.ERROR_INTERNAL_SERVER_SERVICES
    }
}

async function buscarUsuario(id){
    try {
        if (CORRECTION.CHECK_ID(id)) {
            let result = await usuarioDAO.selectByIdUsuario(parseInt(id))
            return result ? { ...MENSAGE.SUCCESS_REQUEST, usuario: result } : MENSAGE.ERROR_NOT_FOUND
        } else {
            return MENSAGE.ERROR_REQUIRED_FIELDS
        }
    } catch (error) {
        console.error(error)
        return MENSAGE.ERROR_INTERNAL_SERVER_SERVICES
    }
}

async function loginUsuario(dadosLogin, contentType){
    try {
        if (contentType == "application/json") {
            const { email, senha } = dadosLogin
            
            if (email && senha) {
                const usuario = await usuarioDAO.selectByEmail(email)
                
                if (usuario) {
                    const senhaValida = encryptionFunction.verifyPassword(senha, usuario.senha_salt, usuario.senha_hash)
                    
                    if (senhaValida) {
                        delete usuario.senha
                        return {
                            ...MENSAGE.SUCCESS_LOGIN,
                            usuario: usuario
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
    inserirUsuario,
    atualizarUsuario,
    excluirUsuario,
    listarTodosUsuarios,
    buscarUsuario,
    loginUsuario
}