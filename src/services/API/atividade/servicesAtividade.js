// src/services/API/atividade/servicesAtividade.js
const MENSAGE = require("../../../modulo/config")
const TableCORRECTION = require("../../../utils/tablesCheck")
const CORRECTION = require("../../../utils/inputCheck")
const atividadeDAO = require("../../../model/DAO/atividade/atividade")

/** Atividades **/

async function inserirAtividade(dadosAtividade, contentType){
    try {
        if (contentType == "application/json") {
            // Remove o campo 'aulas' para o DAO principal, se houver.
            delete dadosAtividade.aulas 

            if (TableCORRECTION.CHECK_tbl_atividades(dadosAtividade)) {
                
                let resultAtividade = await atividadeDAO.insertAtividade(dadosAtividade)
                
                if (resultAtividade) {
                    // Nota: A lógica de inserir aulas em massa foi movida para o service de AULA,
                    // ou será implementada aqui com chamada ao DAO de aula se for inserção em cascata.
                    // Por enquanto, apenas a atividade principal é inserida.
                    
                    return { 
                        ...MENSAGE.SUCCESS_CEATED_ITEM, 
                        atividade: resultAtividade 
                    }
                } else {
                    return MENSAGE.ERROR_INTERNAL_SERVER_MODEL
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

async function atualizarAtividade(dadosAtividade, id, contentType){
    try {
        if (contentType == "application/json") {
            if (CORRECTION.CHECK_ID(id)) {
                
                let resultSearch = await buscarAtividade(parseInt(id))
                
                if (resultSearch.status_code == MENSAGE.SUCCESS_REQUEST.status_code) {
                    
                    dadosAtividade.id = parseInt(id)
                    
                    // Remove campos que não devem ser atualizados se não foram passados (para partial update)
                    if (!dadosAtividade.id_instituicao) delete dadosAtividade.id_instituicao
                    if (!dadosAtividade.id_categoria) delete dadosAtividade.id_categoria

                    if (TableCORRECTION.CHECK_tbl_atividades(dadosAtividade)) { 
                        let result = await atividadeDAO.updateAtividade(dadosAtividade)
                        return result ? MENSAGE.SUCCESS_UPDATED_ITEM : MENSAGE.ERROR_INTERNAL_SERVER_MODEL
                    } else {
                        return MENSAGE.ERROR_REQUIRED_FIELDS
                    }
                    
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

async function excluirAtividade(id){
    try {
        if (CORRECTION.CHECK_ID(id)) {
            let resultSearch = await buscarAtividade(parseInt(id))
            
            if (resultSearch.status_code == MENSAGE.SUCCESS_REQUEST.status_code) {
                let result = await atividadeDAO.deleteAtividade(parseInt(id))
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

async function listarTodasAtividades(){
    try {
        let result = await atividadeDAO.selectAllAtividades()
        if (result) {
            // Deserializa o campo 'horarios' que veio como JSON_ARRAYAGG
            const atividadesFormatadas = result.map(ativ => ({
                ...ativ,
                horarios: JSON.parse(ativ.horarios) 
            }))

            return atividadesFormatadas.length > 0 ? { ...MENSAGE.SUCCESS_REQUEST, atividades: atividadesFormatadas } : MENSAGE.ERROR_NOT_FOUND
        } else {
            return MENSAGE.ERROR_INTERNAL_SERVER_MODEL
        }
    } catch (error) {
        console.error(error)
        return MENSAGE.ERROR_INTERNAL_SERVER_SERVICES
    }
}

async function buscarAtividade(id){
    try {
        if (CORRECTION.CHECK_ID(id)) {
            let result = await atividadeDAO.selectByIdAtividade(parseInt(id))
            if (result) {
                // Deserializa o campo 'horarios'
                result.horarios = JSON.parse(result.horarios)
                return { ...MENSAGE.SUCCESS_REQUEST, atividade: result }
            } else {
                return MENSAGE.ERROR_NOT_FOUND
            }
        } else {
            return MENSAGE.ERROR_REQUIRED_FIELDS
        }
    } catch (error) {
        console.error(error)
        return MENSAGE.ERROR_INTERNAL_SERVER_SERVICES
    }
}


module.exports = {
    inserirAtividade,
    atualizarAtividade,
    excluirAtividade,
    listarTodasAtividades,
    buscarAtividade
}