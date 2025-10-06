// src/services/API/atividade/servicesAula.js
const MENSAGE = require("../../../modulo/config")
const TableCORRECTION = require("../../../utils/tablesCheck")
const CORRECTION = require("../../../utils/inputCheck")
const aulaDAO = require("../../../model/DAO/atividade/aula")

/** Aulas **/

async function inserirAula(dadosAula, contentType){
    try {
        if (contentType == "application/json") {
            if (TableCORRECTION.CHECK_tbl_aulas_atividade(dadosAula)) {
                let result = await aulaDAO.insertAula(dadosAula)
                return result ? { ...MENSAGE.SUCCESS_CEATED_ITEM, aula: result } : MENSAGE.ERROR_INTERNAL_SERVER_MODEL
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

async function atualizarAula(dadosAula, id, contentType){
    try {
        if (contentType == "application/json") {
            if (CORRECTION.CHECK_ID(id)) {
                
                // 1. Checa se a aula existe
                const aulaExiste = await aulaDAO.selectByIdAula(parseInt(id))
                if (!aulaExiste) return MENSAGE.ERROR_NOT_FOUND
                
                // 2. Remove id_atividade se presente no update (não deve ser alterado)
                delete dadosAula.id_atividade 
                dadosAula.id = parseInt(id)

                // 3. Checa a validade dos dados de aula
                if (TableCORRECTION.CHECK_tbl_aulas_atividade(dadosAula)) {
                    let result = await aulaDAO.updateAula(dadosAula)
                    return result ? MENSAGE.SUCCESS_UPDATED_ITEM : MENSAGE.ERROR_INTERNAL_SERVER_MODEL
                } else {
                    return MENSAGE.ERROR_REQUIRED_FIELDS
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

async function excluirAula(id){
    try {
        if (CORRECTION.CHECK_ID(id)) {
            // Checa se a aula existe (implícito no delete do DAO ou explícito aqui)
            const aulaExiste = await aulaDAO.selectByIdAula(parseInt(id))
            if (!aulaExiste) return MENSAGE.ERROR_NOT_FOUND

            let result = await aulaDAO.deleteAula(parseInt(id))
            return result ? MENSAGE.SUCCESS_DELETE_ITEM : MENSAGE.ERROR_NOT_DELETE
        } else {
            return MENSAGE.ERROR_REQUIRED_FIELDS
        }
    } catch (error) {
        console.error(error)
        return MENSAGE.ERROR_INTERNAL_SERVER_SERVICES
    }
}

module.exports = {
    inserirAula,
    atualizarAula,
    excluirAula
}