const MENSAGE = require("../../../modulo/config")
const CORRECTION = require("../../../utils/inputCheck")
const TableCORRECTION = require("../../../utils/tablesCheck")
const tipoNivelDAO = require("../../../model/DAO/usuario/tipoNivel/tipoNivel")

async function inserirTipoNivel(dadosTipoNivel, contentType){
    try {
        if (contentType == "application/json") {
            if (TableCORRECTION.CHECK_tbl_tipo_nivel(dadosTipoNivel)) {
                let result = await tipoNivelDAO.insertTipoNivel(dadosTipoNivel)
                return result ? { ...MENSAGE.SUCCESS_CEATED_ITEM, tipo_nivel: result } : MENSAGE.ERROR_INTERNAL_SERVER_MODEL
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

async function atualizarTipoNivel(dadosTipoNivel, id, contentType){
    try {
        if (contentType == "application/json") {
            if (TableCORRECTION.CHECK_tbl_tipo_nivel(dadosTipoNivel) && CORRECTION.CHECK_ID(id)) {
                let resultSearch = await buscarTipoNivel(parseInt(id))

                if (resultSearch.status_code == MENSAGE.SUCCESS_REQUEST.status_code) {
                    dadosTipoNivel.id = parseInt(id)
                    let result = await tipoNivelDAO.updateTipoNivel(dadosTipoNivel)
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

async function excluirTipoNivel(id){
    try {
        if (CORRECTION.CHECK_ID(id)) {
            let resultSearch = await buscarTipoNivel(parseInt(id))
            if (resultSearch.status_code == MENSAGE.SUCCESS_REQUEST.status_code) {
                let result = await tipoNivelDAO.deleteTipoNivel(parseInt(id))
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

async function listarTodosTiposNivel(){
    try {
        let result = await tipoNivelDAO.selectAllTipoNivel()
        if (result) {
            return result.length > 0 ? { ...MENSAGE.SUCCESS_REQUEST, tipos_nivel: result } : MENSAGE.ERROR_NOT_FOUND
        } else {
            return MENSAGE.ERROR_INTERNAL_SERVER_MODEL
        }
    } catch (error) {
        console.error(error)
        return MENSAGE.ERROR_INTERNAL_SERVER_SERVICES
    }
}

async function buscarTipoNivel(id){
    try {
        if (CORRECTION.CHECK_ID(id)) {
            let result = await tipoNivelDAO.selectByIdTipoNivel(parseInt(id))
            return result ? { ...MENSAGE.SUCCESS_REQUEST, tipo_nivel: result } : MENSAGE.ERROR_NOT_FOUND
        } else {
            return MENSAGE.ERROR_REQUIRED_FIELDS
        }
    } catch (error) {
        console.error(error)
        return MENSAGE.ERROR_INTERNAL_SERVER_SERVICES
    }
}

module.exports = {
    inserirTipoNivel,
    atualizarTipoNivel,
    excluirTipoNivel,
    listarTodosTiposNivel,
    buscarTipoNivel
}