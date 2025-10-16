const MENSAGE = require("../../../../modulo/config")
const CORRECTION = require("../../../../utils/inputCheck")
const TableCORRECTION = require("../../../../utils/tablesCheck")
const inscricaoAtividadeDAO = require("../../../../model/DAO/atividade/inscricaoAtividade/inscricaoAtividade")


// --- CREATE ---
async function inserirInscricaoAtividade(dadosInscricao, contentType){
    try {
        if (contentType !== "application/json") {
            return MENSAGE.ERROR_CONTENT_TYPE
        }
        if (
            TableCORRECTION.CHECK_tbl_inscricao_atividade(dadosInscricao)
        ) {
            return MENSAGE.ERROR_REQUIRED_FIELDS
        }

        // Validação de IDs opcionais
        if (dadosInscricao.id_responsavel && !CORRECTION.CHECK_ID(dadosInscricao.id_responsavel)) {
            return MENSAGE.ERROR_INVALID_PARAM
        }
        
        const resultInscricao = await inscricaoAtividadeDAO.insertInscricaoAtividade(dadosInscricao)

        if (resultInscricao) {
            return {
                ...MENSAGE.SUCCESS_CEATED_ITEM,
                inscricao: resultInscricao
            }
        } else {
            return MENSAGE.ERROR_INTERNAL_SERVER_MODEL
        }

    } catch (error) {
        console.error(error)
        return MENSAGE.ERROR_INTERNAL_SERVER_SERVICES
    }
}

// --- READ ALL / LIST ALL ---
async function listarTodasInscricoes(){
    try {
        const result = await inscricaoAtividadeDAO.selectAllInscricoes()
        
        if (result) {
            return result.length > 0 ? { ...MENSAGE.SUCCESS_REQUEST, inscricoes: result } : MENSAGE.ERROR_NOT_FOUND
        } else {
            return MENSAGE.ERROR_INTERNAL_SERVER_MODEL
        }
    } catch (error) {
        console.error(error)
        return MENSAGE.ERROR_INTERNAL_SERVER_SERVICES
    }
}

// --- READ BY ID ---
async function buscarInscricaoPorId(id){
    try {
        if (!CORRECTION.CHECK_ID(id)) {
            return MENSAGE.ERROR_REQUIRED_FIELDS
        }
        
        const result = await inscricaoAtividadeDAO.selectByIdInscricao(parseInt(id))
        
        return result ? { ...MENSAGE.SUCCESS_REQUEST, inscricao: result } : MENSAGE.ERROR_NOT_FOUND

    } catch (error) {
        console.error(error)
        return MENSAGE.ERROR_INTERNAL_SERVER_SERVICES
    }
}

// --- UPDATE ---
async function atualizarInscricaoAtividade(novosDados, id, contentType){
    try {
        if (contentType !== "application/json") {
            return MENSAGE.ERROR_CONTENT_TYPE
        }
        
        if (!CORRECTION.CHECK_ID(id)) {
            return MENSAGE.ERROR_REQUIRED_FIELDS
        }
        
        const resultSearch = await buscarInscricaoPorId(parseInt(id))

        if (resultSearch.status_code === MENSAGE.SUCCESS_REQUEST.status_code) {
            
            // Validações de dados de entrada
            if (novosDados.id_status && !CORRECTION.CHECK_ID(novosDados.id_status)) return MENSAGE.ERROR_INVALID_PARAM
            if (novosDados.id_responsavel !== undefined && novosDados.id_responsavel !== null && !CORRECTION.CHECK_ID(novosDados.id_responsavel)) return MENSAGE.ERROR_INVALID_PARAM
            if (novosDados.observacao !== undefined && novosDados.observacao !== null && !CORRECTION.CHECK_VARCHAR(novosDados.observacao, 300)) return MENSAGE.ERROR_INVALID_PARAM
            
            const result = await inscricaoAtividadeDAO.updateInscricao(parseInt(id), novosDados)
            
            return result ? MENSAGE.SUCCESS_UPDATED_ITEM : MENSAGE.ERROR_INTERNAL_SERVER_MODEL

        } else if (resultSearch.status_code === MENSAGE.ERROR_NOT_FOUND.status_code) {
            return MENSAGE.ERROR_NOT_FOUND
        } else {
            return MENSAGE.ERROR_INTERNAL_SERVER_SERVICES
        }

    } catch (error) {
        console.error(error)
        return MENSAGE.ERROR_INTERNAL_SERVER_SERVICES
    }
}

// --- DELETE ---
async function excluirInscricao(id){
    try {
        if (!CORRECTION.CHECK_ID(id)) {
            return MENSAGE.ERROR_REQUIRED_FIELDS
        }
        
        const resultSearch = await buscarInscricaoPorId(parseInt(id))
        
        if (resultSearch.status_code === MENSAGE.SUCCESS_REQUEST.status_code) {
            
            const result = await inscricaoAtividadeDAO.deleteInscricao(parseInt(id))
            return result ? MENSAGE.SUCCESS_DELETE_ITEM : MENSAGE.ERROR_NOT_DELETE
        
        } else if (resultSearch.status_code === MENSAGE.ERROR_NOT_FOUND.status_code) {
            return MENSAGE.ERROR_NOT_FOUND
        } else {
            return MENSAGE.ERROR_INTERNAL_SERVER_SERVICES
        }
    } catch (error) {
        console.error(error)
        return MENSAGE.ERROR_INTERNAL_SERVER_SERVICES
    }
}


module.exports = {
    inserirInscricaoAtividade,
    listarTodasInscricoes,
    buscarInscricaoPorId,
    atualizarInscricaoAtividade,
    excluirInscricao
}