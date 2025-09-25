const MENSAGE = require("../../../modulo/config")
const CORRECTION = require("../../../utils/inputCheck")
const TableCORRECTION = require("../../../utils/tablesCheck")
const encryptionFunction = require("../../../utils/encryptionFunction")
const usuarioDAO = require("../../../model/DAO/usuario/usuario")
const servicesEndereco = require("../endereco/servicesEndereco")

const inserirUsuario = async (dadosUsuario, contentType) => {
    try {
        if (contentType !== "application/json") {
            return MENSAGE.ERROR_CONTENT_TYPE
        }

        if (!TableCORRECTION.CHECK_tbl_usuario(dadosUsuario)) {
            return MENSAGE.ERROR_REQUIRED_FIELDS
        }

        const emailExists = await usuarioDAO.verifyEmailExists(dadosUsuario.email)
        if (emailExists) {
            return MENSAGE.ERROR_EMAIL_ALREADY_EXISTS // Adicione esta mensagem ao seu config.js
        }

        const { senha_hash } = encryptionFunction.hashPassword(dadosUsuario.senha)
        dadosUsuario.senha = senha_hash

        let result = await usuarioDAO.insertUsuario(dadosUsuario)
        return result ? { ...MENSAGE.SUCCESS_CEATED_ITEM, usuario: result } : MENSAGE.ERROR_INTERNAL_SERVER_MODEL

    } catch (error) {
        console.error(error)
        return MENSAGE.ERROR_INTERNAL_SERVER_SERVICES
    }
}

const atualizarUsuario = async (dadosUsuario, id, contentType) => {
    try {
        if (contentType !== "application/json") {
            return MENSAGE.ERROR_CONTENT_TYPE
        }

        if (!TableCORRECTION.CHECK_tbl_usuario(dadosUsuario) || !CORRECTION.CHECK_ID(id)) {
            return MENSAGE.ERROR_REQUIRED_FIELDS
        }

        const usuarioExistente = await usuarioDAO.selectByIdUsuario(parseInt(id))
        if (!usuarioExistente) {
            return MENSAGE.ERROR_NOT_FOUND
        }

        // Se o email for alterado, verifica se já existe
        if (dadosUsuario.email !== usuarioExistente.email) {
            const emailExists = await usuarioDAO.verifyEmailExists(dadosUsuario.email)
            if (emailExists) {
                return MENSAGE.ERROR_EMAIL_ALREADY_EXISTS
            }
        }

        const { senha_hash } = encryptionFunction.hashPassword(dadosUsuario.senha)
        dadosUsuario.senha = senha_hash
        dadosUsuario.id = parseInt(id)

        let result = await usuarioDAO.updateUsuario(dadosUsuario)
        return result ? MENSAGE.SUCCESS_UPDATED_ITEM : MENSAGE.ERROR_INTERNAL_SERVER_MODEL

    } catch (error) {
        console.error(error)
        return MENSAGE.ERROR_INTERNAL_SERVER_SERVICES
    }
}

const excluirUsuario = async (id) => {
    try {
        if (!CORRECTION.CHECK_ID(id)) {
            return MENSAGE.ERROR_REQUIRED_FIELDS
        }

        let resultSearch = await usuarioDAO.selectByIdUsuario(parseInt(id))
        if (!resultSearch) {
            return MENSAGE.ERROR_NOT_FOUND
        }

        let result = await usuarioDAO.deleteUsuario(parseInt(id))
        return result ? MENSAGE.SUCCESS_DELETE_ITEM : MENSAGE.ERROR_NOT_DELETE

    } catch (error) {
        console.error(error)
        return MENSAGE.ERROR_INTERNAL_SERVER_SERVICES
    }
}

const listarTodosUsuarios = async () => {
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

const buscarUsuario = async (id) => {
    try {
        if (!CORRECTION.CHECK_ID(id)) {
            return MENSAGE.ERROR_REQUIRED_FIELDS
        }

        let result = await usuarioDAO.selectByIdUsuario(parseInt(id))
        return result ? { ...MENSAGE.SUCCESS_REQUEST, usuario: result } : MENSAGE.ERROR_NOT_FOUND

    } catch (error) {
        console.error(error)
        return MENSAGE.ERROR_INTERNAL_SERVER_SERVICES
    }
}

const loginUsuario = async (dadosLogin, contentType) => {
    try {
        if (contentType !== "application/json") {
            return MENSAGE.ERROR_CONTENT_TYPE
        }

        const { email, senha } = dadosLogin
        if (!email || !senha) {
            return MENSAGE.ERROR_REQUIRED_FIELDS
        }

        const usuario = await usuarioDAO.selectByEmail(email)
        if (!usuario) {
            return MENSAGE.ERROR_INVALID_CREDENTIALS
        }

        const senhaValida = encryptionFunction.verifyPassword(senha, usuario.senha_salt, usuario.senha_hash)
        if (!senhaValida) {
            return MENSAGE.ERROR_INVALID_CREDENTIALS
        }

        // Sucesso no login, retorna os dados do usuário
        delete usuario.senha
        return {
            ...MENSAGE.SUCCESS_LOGIN,
            usuario: usuario
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