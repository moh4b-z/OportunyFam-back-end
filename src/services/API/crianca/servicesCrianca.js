// src/services/API/crianca/servicesCrianca.js

const MENSAGE = require("../../../modulo/config")
const CORRECTION = require("../../../utils/inputCheck")
const TableCORRECTION = require("../../../utils/tablesCheck")
const encryptionFunction = require("../../../utils/encryptionFunction")
const criancaDAO = require("../../../model/DAO/crianca/crianca")
const usuarioDAO = require("../../../model/DAO/usuario/usuario") // Para a validação de e-mail

async function inserirCrianca(dadosCrianca, contentType) {
    try {
        if (contentType == "application/json") {
            if (TableCORRECTION.CHECK_tbl_crianca(dadosCrianca)) {
                let emailExists = await usuarioDAO.verifyEmailExists(dadosCrianca.email)
                if (emailExists) {
                    return MENSAGE.ERROR_EMAIL_ALREADY_EXISTS
                }

                let { senha_hash } = encryptionFunction.hashPassword(dadosCrianca.senha)
                dadosCrianca.senha = senha_hash

                let result = await criancaDAO.insertCrianca(dadosCrianca)
                return result ? { ...MENSAGE.SUCCESS_CEATED_ITEM, crianca: result } : MENSAGE.ERROR_INTERNAL_SERVER_MODEL
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

async function atualizarCrianca(dadosCrianca, id, contentType) {
    try {
        if (contentType == "application/json") {
            if (TableCORRECTION.CHECK_tbl_crianca(dadosCrianca) && CORRECTION.CHECK_ID(id)) {
                let resultSearch = await buscarCrianca(parseInt(id))
                if (resultSearch.status_code == MENSAGE.SUCCESS_REQUEST.status_code) {
                    if (dadosCrianca.email && dadosCrianca.email !== resultSearch.crianca.email) {
                        let emailExists = await usuarioDAO.verifyEmailExists(dadosCrianca.email)
                        if (emailExists) {
                            return MENSAGE.ERROR_EMAIL_ALREADY_EXISTS
                        }
                    }

                    let { senha_hash } = encryptionFunction.hashPassword(dadosCrianca.senha)
                    dadosCrianca.senha = senha_hash
                    dadosCrianca.id = parseInt(id)

                    let result = await criancaDAO.updateCrianca(dadosCrianca)
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

async function excluirCrianca(id) {
    try {
        if (CORRECTION.CHECK_ID(id)) {
            let resultSearch = await buscarCrianca(parseInt(id))
            if (resultSearch.status_code == MENSAGE.SUCCESS_REQUEST.status_code) {
                let result = await criancaDAO.deleteCrianca(parseInt(id))
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

async function listarTodasCriancas() {
    try {
        let result = await criancaDAO.selectAllCriancas()
        if (result) {
            return result.length > 0 ? { ...MENSAGE.SUCCESS_REQUEST, criancas: result } : MENSAGE.ERROR_NOT_FOUND
        } else {
            return MENSAGE.ERROR_INTERNAL_SERVER_MODEL
        }
    } catch (error) {
        console.error(error)
        return MENSAGE.ERROR_INTERNAL_SERVER_SERVICES
    }
}

async function buscarCrianca(id) {
    try {
        if (CORRECTION.CHECK_ID(id)) {
            let result = await criancaDAO.selectByIdCrianca(parseInt(id))
            return result ? { ...MENSAGE.SUCCESS_REQUEST, crianca: result } : MENSAGE.ERROR_NOT_FOUND
        } else {
            return MENSAGE.ERROR_REQUIRED_FIELDS
        }
    } catch (error) {
        console.error(error)
        return MENSAGE.ERROR_INTERNAL_SERVER_SERVICES
    }
}

async function loginCrianca(dadosLogin, contentType) {
    try {
        if (contentType == "application/json") {
            const { email, senha } = dadosLogin
            if (!email || !senha) {
                return MENSAGE.ERROR_REQUIRED_FIELDS
            }

            const crianca = await criancaDAO.selectByEmail(email)
            if (!crianca) {
                return MENSAGE.ERROR_INVALID_CREDENTIALS
            }

            const senhaValida = encryptionFunction.verifyPassword(senha, crianca.senha_salt, crianca.senha_hash)
            if (!senhaValida) {
                return MENSAGE.ERROR_INVALID_CREDENTIALS
            }

            delete crianca.senha
            return {
                ...MENSAGE.SUCCESS_LOGIN,
                crianca: crianca
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
    inserirCrianca,
    atualizarCrianca,
    excluirCrianca,
    listarTodasCriancas,
    buscarCrianca,
    loginCrianca
}