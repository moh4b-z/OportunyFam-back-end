const MENSAGE = require("../../../../modulo/config")
const CORRECTION = require("../../../../utils/inputCheck")
const matriculaAulaDAO = require("../../../../model/DAO/inscricao/matriculaAula")
const TableCORRECTION = require("../../../../utils/tablesCheck") 

// --- CREATE ---
async function inserirMatriculaAula(dadosMatricula, contentType){
    try {
        if (contentType !== "application/json") {
            return MENSAGE.ERROR_CONTENT_TYPE
        }
        
        // Validação dos campos obrigatórios e tipos
        if (
            !(TableCORRECTION.CHECK_tbl_matricula_aula(dadosMatricula)) ||
            typeof dadosMatricula.presente !== 'boolean'
        ) {
            return MENSAGE.ERROR_REQUIRED_FIELDS
        }
        
        // Validação da observação
        if (dadosMatricula.nota_observacao !== undefined && dadosMatricula.nota_observacao !== null && !CORRECTION.CHECK_VARCHAR(dadosMatricula.nota_observacao, 500)) {
            return MENSAGE.ERROR_INVALID_PARAM
        }
        
        const resultMatricula = await matriculaAulaDAO.insertMatriculaAula(dadosMatricula)

        if (resultMatricula) {
            return {
                ...MENSAGE.SUCCESS_CEATED_ITEM,
                matricula: resultMatricula
            }
        } else {
            return MENSAGE.ERROR_INTERNAL_SERVER_MODEL
        }

    } catch (error) {
        console.error(error)
        return MENSAGE.ERROR_INTERNAL_SERVER_SERVICES
    }
}

// --- READ BY INSCRICAO ID ---
async function listarMatriculasPorInscricao(idInscricao){
    try {
        if (!CORRECTION.CHECK_ID(idInscricao)) {
            return MENSAGE.ERROR_REQUIRED_FIELDS
        }
        
        const result = await matriculaAulaDAO.selectMatriculasByInscricao(parseInt(idInscricao))
        
        if (result) {
            return result.length > 0 ? { ...MENSAGE.SUCCESS_REQUEST, matriculas: result } : MENSAGE.ERROR_NOT_FOUND
        } else {
            return MENSAGE.ERROR_INTERNAL_SERVER_MODEL
        }
    } catch (error) {
        console.error(error)
        return MENSAGE.ERROR_INTERNAL_SERVER_SERVICES
    }
}

// --- UPDATE ---
async function atualizarMatriculaAula(dadosAtualizados, id, contentType){
    try {
        if (contentType !== "application/json") {
            return MENSAGE.ERROR_CONTENT_TYPE
        }
        
        if (!CORRECTION.CHECK_ID(id)) {
            return MENSAGE.ERROR_REQUIRED_FIELDS
        }

        // Validação de presença
        if (dadosAtualizados.presente !== undefined && typeof dadosAtualizados.presente !== 'boolean') {
            return MENSAGE.ERROR_INVALID_PARAM
        }
        
        // Validação da observação
        if (dadosAtualizados.nota_observacao !== undefined && dadosAtualizados.nota_observacao !== null && !CORRECTION.CHECK_VARCHAR(dadosAtualizados.nota_observacao, 500)) {
            return MENSAGE.ERROR_INVALID_PARAM
        }
        
        const result = await matriculaAulaDAO.updateMatriculaAula(parseInt(id), dadosAtualizados)
        
        return result ? MENSAGE.SUCCESS_UPDATED_ITEM : MENSAGE.ERROR_INTERNAL_SERVER_MODEL

    } catch (error) {
        console.error(error)
        return MENSAGE.ERROR_INTERNAL_SERVER_SERVICES
    }
}

// --- DELETE ---
async function excluirMatriculaAula(id){
    try {
        if (!CORRECTION.CHECK_ID(id)) {
            return MENSAGE.ERROR_REQUIRED_FIELDS
        }
        
        const result = await matriculaAulaDAO.deleteMatriculaAula(parseInt(id))
        
        return result ? MENSAGE.SUCCESS_DELETE_ITEM : MENSAGE.ERROR_NOT_DELETE
        
    } catch (error) {
        console.error(error)
        return MENSAGE.ERROR_INTERNAL_SERVER_SERVICES
    }
}

module.exports = {
    inserirMatriculaAula,
    listarMatriculasPorInscricao,
    atualizarMatriculaAula,
    excluirMatriculaAula
}