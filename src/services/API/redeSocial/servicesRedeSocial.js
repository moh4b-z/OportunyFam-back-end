const MENSAGE = require("../../../modulo/config")
const CORRECTION = require("../../../utils/inputCheck")
const TableCORRECTION = require("../../../utils/tablesCheck")
const redeSocialDAO = require("../../../model/DAO/redeSocial/redeSocial")

async function inserirRedeSocial(dadosRedeSocial, contentType) {
    try {
        if (contentType == "application/json") {
            if (TableCORRECTION.CHECK_tbl_rede_social(dadosRedeSocial)) {
                let result = await redeSocialDAO.insertRedeSocial(dadosRedeSocial)
                return result ? { ...MENSAGE.SUCCESS_CEATED_ITEM, rede_social: result } : MENSAGE.ERROR_INTERNAL_SERVER_MODEL
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

async function atualizarRedeSocial(dadosRedeSocial, id, contentType) {
    try {
        if (contentType == "application/json") {
            if (TableCORRECTION.CHECK_tbl_rede_social(dadosRedeSocial) && CORRECTION.CHECK_ID(id)) {
                let resultSearch = await buscarRedeSocial(parseInt(id))

                if (resultSearch.status_code == MENSAGE.SUCCESS_REQUEST.status_code) {
                    dadosRedeSocial.id = parseInt(id)
                    let result = await redeSocialDAO.updateRedeSocial(dadosRedeSocial)
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

async function excluirRedeSocial(id) {
    try {
        if (CORRECTION.CHECK_ID(id)) {
            let resultSearch = await buscarRedeSocial(parseInt(id))
            if (resultSearch.status_code == MENSAGE.SUCCESS_REQUEST.status_code) {
                let result = await redeSocialDAO.deleteRedeSocial(parseInt(id))
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

async function listarTodasRedesSociais() {
    try {
        let result = await redeSocialDAO.selectAllRedesSociais()
        if (result) {
            return result.length > 0 ? { ...MENSAGE.SUCCESS_REQUEST, redes_sociais: result } : MENSAGE.ERROR_NOT_FOUND
        } else {
            return MENSAGE.ERROR_INTERNAL_SERVER_MODEL
        }
    } catch (error) {
        console.error(error)
        return MENSAGE.ERROR_INTERNAL_SERVER_SERVICES
    }
}

async function buscarRedeSocial(id) {
    try {
        if (CORRECTION.CHECK_ID(id)) {
            let result = await redeSocialDAO.selectByIdRedeSocial(parseInt(id))
            return result ? { ...MENSAGE.SUCCESS_REQUEST, rede_social: result } : MENSAGE.ERROR_NOT_FOUND
        } else {
            return MENSAGE.ERROR_REQUIRED_FIELDS
        }
    } catch (error) {
        console.error(error)
        return MENSAGE.ERROR_INTERNAL_SERVER_SERVICES
    }
}

module.exports = {
    inserirRedeSocial,
    atualizarRedeSocial,
    excluirRedeSocial,
    listarTodasRedesSociais,
    buscarRedeSocial
}