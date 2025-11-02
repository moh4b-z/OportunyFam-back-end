const MENSAGE = require("../../../modulo/config")
const CORRECTION = require("../../../utils/inputCheck")
const TableCORRECTION = require("../../../utils/tablesCheck")
const encryptionFunction = require("../../../utils/encryptionFunction")
const criancaDAO = require("../../../model/DAO/crianca/crianca")
const loginDAO = require("../../../model/DAO/login")
const responsavelDAO = require("../../../model/DAO/usuario/responsavel/responsavel")

async function inserirCrianca(dadosCrianca, contentType) {
    try {
        if (contentType == "application/json") {
            if (TableCORRECTION.CHECK_tbl_crianca(dadosCrianca) && dadosCrianca.id_usuario) {
                const emailExists = await loginDAO.verifyEmailExists(dadosCrianca.email)
                if (emailExists) {
                    return MENSAGE.ERROR_EMAIL_ALREADY_EXISTS
                }
                const cpfExists = await loginDAO.verifyCPFExists(dadosCrianca.cpf)
                if (cpfExists) {
                    return MENSAGE.ERROR_CPF_ALREADY_EXISTS
                }

                let senha_hash  = encryptionFunction.hashPassword(dadosCrianca.senha)
                dadosCrianca.senha = senha_hash

                let result = await criancaDAO.insertCrianca(dadosCrianca)
                if(result){
                    let resultResponsavel = await responsavelDAO.insertResponsavel({
                        id_usuario: dadosCrianca.id_usuario,
                        id_crianca: result.id
                    })
                    return result ? { ...MENSAGE.SUCCESS_CEATED_ITEM, crianca: result } : MENSAGE.ERROR_INTERNAL_SERVER_MODEL
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

async function atualizarCrianca(dadosCrianca, id, contentType) {
    try {
        if (contentType == "application/json") {
            if (TableCORRECTION.CHECK_tbl_crianca(dadosCrianca) && CORRECTION.CHECK_ID(id)) {
                let resultSearch = await buscarCrianca(parseInt(id))
                if (resultSearch.status_code == MENSAGE.SUCCESS_REQUEST.status_code) {
                    if (dadosCrianca.email && dadosCrianca.email !== resultSearch.crianca.email) {
                        let emailExists = await loginDAO.verifyEmailExists(dadosCrianca.email)
                        if (emailExists) {
                            return MENSAGE.ERROR_EMAIL_ALREADY_EXISTS
                        }
                    }
                    if (dadosCrianca.cpf && dadosCrianca.cpf !== resultSearch.crianca.cpf) {
                        const cpfExists = await loginDAO.verifyCPFExists(dadosCrianca.cpf)
                        if (cpfExists) {
                            return MENSAGE.ERROR_CPF_ALREADY_EXISTS
                        }
                    }

                    let senha_hash = encryptionFunction.hashPassword(dadosCrianca.senha)
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


module.exports = {
    inserirCrianca,
    atualizarCrianca,
    excluirCrianca,
    listarTodasCriancas,
    buscarCrianca
}