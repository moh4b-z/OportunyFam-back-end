const MENSAGE = require("../../../modulo/config")
const CORRECTION = require("../../../utils/inputCheck")
const TableCORRECTION = require("../../../utils/tablesCheck")
const encryptionFunction = require("../../../utils/encryptionFunction")
const usuarioDAO = require("../../../model/DAO/usuario/usuario")
const loginDAO = require("../../../model/DAO/login")
const usuarioEnderecoDAO = require("../../../model/DAO/usuario/usuarioEndereco/usuarioEndereco") 
const servicesEndereco = require("../endereco/servicesEndereco")

async function inserirUsuario(dadosUsuario, contentType){
    try {        
        if (contentType == "application/json") {
            if (dadosUsuario.cep && TableCORRECTION.CHECK_tbl_usuario(dadosUsuario)) {
                
                const emailExists = await loginDAO.verifyEmailExists(dadosUsuario.email)
                if (emailExists) {
                    return MENSAGE.ERROR_EMAIL_ALREADY_EXISTS
                }
                const cpfExists = await loginDAO.verifyCPFExists(dadosUsuario.cpf)
                if (cpfExists) {
                    return MENSAGE.ERROR_CPF_ALREADY_EXISTS
                }
                
                const senha_hash = encryptionFunction.hashPassword(dadosUsuario.senha)
                dadosUsuario.senha = senha_hash

                let endereco = { 
                    cep: dadosUsuario.cep, 
                    numero: dadosUsuario.numero, 
                    complemento: dadosUsuario.complemento,
                    cidade: dadosUsuario.cidade,
                    bairro: dadosUsuario.bairro,
                    logradouro: dadosUsuario.logradouro,
                    estado: dadosUsuario.estado,
                }

                const enderecoCriado = await servicesEndereco.inserirEndereco(endereco, contentType)

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
            if (CORRECTION.CHECK_ID(id)) {
                
                let resultSearch = await buscarUsuario(parseInt(id))
                
                if (resultSearch.status_code == MENSAGE.SUCCESS_REQUEST.status_code) {
                    
                    const usuarioExistente = resultSearch.usuario

                    // Prepara os dados para atualização mantendo valores existentes se não fornecidos
                    const dadosAtualizados = {
                        nome: dadosUsuario.nome || usuarioExistente.nome,
                        email: dadosUsuario.email || usuarioExistente.email,
                        senha: dadosUsuario.senha ? encryptionFunction.hashPassword(dadosUsuario.senha) : usuarioExistente.senha,
                        telefone: 'telefone' in dadosUsuario ? dadosUsuario.telefone : usuarioExistente.telefone,
                        foto_perfil: 'foto_perfil' in dadosUsuario ? dadosUsuario.foto_perfil : usuarioExistente.foto_perfil,
                        cpf: dadosUsuario.cpf || usuarioExistente.cpf,
                        data_nascimento: dadosUsuario.data_nascimento || usuarioExistente.data_nascimento,
                        id_sexo: dadosUsuario.id_sexo || usuarioExistente.id_sexo,
                        id_tipo_nivel: dadosUsuario.id_tipo_nivel || usuarioExistente.id_tipo_nivel,
                        id: parseInt(id)
                    }

                    // Valida apenas se o email for alterado
                    if (dadosUsuario.email && dadosUsuario.email !== usuarioExistente.email) {
                        const emailExists = await loginDAO.verifyEmailExists(dadosUsuario.email)
                        if (emailExists) {
                            return MENSAGE.ERROR_EMAIL_ALREADY_EXISTS
                        }
                    }

                    // Valida apenas se o CPF for alterado
                    if (dadosUsuario.cpf && dadosUsuario.cpf !== usuarioExistente.cpf) {
                        const cpfExists = await loginDAO.verifyCPFExists(dadosUsuario.cpf, usuarioExistente.pessoa_id)
                        if (cpfExists) {
                            return MENSAGE.ERROR_CPF_ALREADY_EXISTS
                        }
                    }

                    // 3. Atualiza o Usuário
                    let result = await usuarioDAO.updateUsuario(dadosAtualizados)
                    
                    return result ? { ...MENSAGE.SUCCESS_UPDATED_ITEM, usuario: result } : MENSAGE.ERROR_INTERNAL_SERVER_MODEL
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


module.exports = {
    inserirUsuario,
    atualizarUsuario,
    excluirUsuario,
    listarTodosUsuarios,
    buscarUsuario
}