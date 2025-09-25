const MENSAGE = require("../../../modulo/config")
const CORRECTION = require("../../../utils/inputCheck")
const TableCORRECTION = require("../../../utils/tablesCheck")
const encryptionFunction = require("../../../utils/encryptionFunction")
const instituicaoDAO = require("../../../model/DAO/instituicao/instituicao")
const usuarioDAO = require("../../../model/DAO/usuario/usuario") // Reutiliza a função de validação de e-mail
const instituicaoEnderecoDAO = require("../../../model/DAO/instituicaoEndereco/instituicaoEndereco")
const servicesEndereco = require("../endereco/servicesEndereco")

const inserirInstituicao = async (dadosInstituicao, contentType) => {
    try {
        if (contentType !== "application/json") {
            return MENSAGE.ERROR_CONTENT_TYPE
        }

        if (!dadosInstituicao.cep || !TableCORRECTION.CHECK_tbl_instituicao(dadosInstituicao)) {
            return MENSAGE.ERROR_REQUIRED_FIELDS
        }

        const emailExists = await usuarioDAO.verifyEmailExists(dadosInstituicao.email)
        if (emailExists) {
            return MENSAGE.ERROR_EMAIL_ALREADY_EXISTS
        }

        const { senha_hash } = encryptionFunction.hashPassword(dadosInstituicao.senha)
        dadosInstituicao.senha = senha_hash

        const enderecoCriado = await servicesEndereco.inserirEndereco({ cep: dadosInstituicao.cep }, contentType)
        if (enderecoCriado.status_code !== MENSAGE.SUCCESS_CEATED_ITEM.status_code) {
            return enderecoCriado
        }
        const idEndereco = enderecoCriado.endereco.id

        let resultInstituicao = await instituicaoDAO.insertInstituicao(dadosInstituicao)
        if (!resultInstituicao) {
            return MENSAGE.ERROR_INTERNAL_SERVER_MODEL
        }
        const idInstituicao = resultInstituicao.id

        const dadosRelacao = { id_instituicao: idInstituicao, id_endereco: idEndereco }
        const resultRelacao = await instituicaoEnderecoDAO.insertInstituicaoEndereco(dadosRelacao)

        if (resultRelacao) {
            return {
                ...MENSAGE.SUCCESS_CEATED_ITEM,
                instituicao: resultInstituicao
            }
        } else {
            await instituicaoDAO.deleteInstituicao(idInstituicao)
            return MENSAGE.ERROR_INTERNAL_SERVER_MODEL
        }
    } catch (error) {
        console.error(error)
        return MENSAGE.ERROR_INTERNAL_SERVER_SERVICES
    }
}

const atualizarInstituicao = async (dadosInstituicao, id, contentType) => {
    try {
        if (contentType !== "application/json") {
            return MENSAGE.ERROR_CONTENT_TYPE
        }

        if (!TableCORRECTION.CHECK_tbl_instituicao(dadosInstituicao) || !CORRECTION.CHECK_ID(id)) {
            return MENSAGE.ERROR_REQUIRED_FIELDS
        }

        const instituicaoExistente = await instituicaoDAO.selectByIdInstituicao(parseInt(id))
        if (!instituicaoExistente) {
            return MENSAGE.ERROR_NOT_FOUND
        }

        if (dadosInstituicao.email !== instituicaoExistente.email) {
            const emailExists = await usuarioDAO.verifyEmailExists(dadosInstituicao.email)
            if (emailExists) {
                return MENSAGE.ERROR_EMAIL_ALREADY_EXISTS
            }
        }

        const { senha_hash } = encryptionFunction.hashPassword(dadosInstituicao.senha)
        dadosInstituicao.senha = senha_hash
        dadosInstituicao.id = parseInt(id)

        let result = await instituicaoDAO.updateInstituicao(dadosInstituicao)
        return result ? MENSAGE.SUCCESS_UPDATED_ITEM : MENSAGE.ERROR_INTERNAL_SERVER_MODEL
    } catch (error) {
        console.error(error)
        return MENSAGE.ERROR_INTERNAL_SERVER_SERVICES
    }
}

const excluirInstituicao = async (id) => {
    try {
        if (!CORRECTION.CHECK_ID(id)) {
            return MENSAGE.ERROR_REQUIRED_FIELDS
        }

        const instituicaoExistente = await instituicaoDAO.selectByIdInstituicao(parseInt(id))
        if (!instituicaoExistente) {
            return MENSAGE.ERROR_NOT_FOUND
        }

        let result = await instituicaoDAO.deleteInstituicao(parseInt(id))
        return result ? MENSAGE.SUCCESS_DELETE_ITEM : MENSAGE.ERROR_NOT_DELETE
    } catch (error) {
        console.error(error)
        return MENSAGE.ERROR_INTERNAL_SERVER_SERVICES
    }
}

const listarTodasInstituicoes = async () => {
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

const buscarInstituicao = async (id) => {
    try {
        if (!CORRECTION.CHECK_ID(id)) {
            return MENSAGE.ERROR_REQUIRED_FIELDS
        }

        let result = await instituicaoDAO.selectByIdInstituicao(parseInt(id))
        return result ? { ...MENSAGE.SUCCESS_REQUEST, instituicao: result } : MENSAGE.ERROR_NOT_FOUND
    } catch (error) {
        console.error(error)
        return MENSAGE.ERROR_INTERNAL_SERVER_SERVICES
    }
}

const loginInstituicao = async (dadosLogin, contentType) => {
    try {
        if (contentType !== "application/json") {
            return MENSAGE.ERROR_CONTENT_TYPE
        }

        const { email, senha } = dadosLogin
        if (!email || !senha) {
            return MENSAGE.ERROR_REQUIRED_FIELDS
        }

        const instituicao = await instituicaoDAO.selectByEmail(email)
        if (!instituicao) {
            return MENSAGE.ERROR_INVALID_CREDENTIALS
        }

        const senhaValida = encryptionFunction.verifyPassword(senha, instituicao.senha_salt, instituicao.senha_hash)
        if (!senhaValida) {
            return MENSAGE.ERROR_INVALID_CREDENTIALS
        }

        delete instituicao.senha
        return {
            ...MENSAGE.SUCCESS_LOGIN,
            instituicao: instituicao
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