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
        //console.log(result);
        
        if (result) {
            // Deserializa o campo 'horarios' que veio como JSON_ARRAYAGG
            const atividadesFormatadas = result.map(ativ => ({
                ...ativ,
                preco: Number(ativ.preco),
                aulas: ativ.aulas ? ativ.aulas.map(aula => ({
                    ...aula, 
                    hora_inicio: aula.hora_inicio ? aula.hora_inicio.split('.')[0] : null, 
                    hora_fim: aula.hora_fim ? aula.hora_fim.split('.')[0] : null
                })) : []
            }))

            return atividadesFormatadas.length > 0 ? { ...MENSAGE.SUCCESS_REQUEST, atividades: atividadesFormatadas } : MENSAGE.ERROR_NOT_FOUND
        } else {
            return MENSAGE.ERROR_INTERNAL_SERVER_MODEL
        }
    } catch (error) {
        console.error(error)
        console.log(error)
        console.log("--")
        return MENSAGE.ERROR_INTERNAL_SERVER_SERVICES
    }
}

async function buscarAtividade(id){
    try {
        if (CORRECTION.CHECK_ID(id)) {
            const result = await atividadeDAO.selectByIdAtividade(parseInt(id))
            if (result) {
                result.preco = Number(result.preco)
                result.aulas = result.aulas ? result.aulas.map(aula => ({
                    ...aula, 
                    hora_inicio: aula.hora_inicio ? aula.hora_inicio.split('.')[0] : null, 
                    hora_fim: aula.hora_fim ? aula.hora_fim.split('.')[0] : null
                })) : []
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

async function buscarAtividadePorInstituicao(id){
    try {
        if (CORRECTION.CHECK_ID(id)) {
            // O DAO retorna um ARRAY de atividades
            const result = await atividadeDAO.selectByIdInstituicaoAtividade(parseInt(id))
            console.log(result);
            
            
            if (result && result.length > 0) {
                // Iterar sobre o array de atividades retornado pelo DAO
                const atividadesFormatadas = result.map(ativ => {
                    
                    
                    // **2. Formatação das Aulas (JSON e Hora)**
                    const aulasFormatadas = ativ.aulas && Array.isArray(ativ.aulas) 
                        ? ativ.aulas.map(aula => ({
                            ...aula, 
                            hora_inicio: aula.hora_inicio ? aula.hora_inicio.split('.')[0] : null, 
                            hora_fim: aula.hora_fim ? aula.hora_fim.split('.')[0] : null
                        })) 
                        : [];

                    return {
                        ...ativ,
                        preco: Number(ativ.preco), // Aplica as correções numéricas
                        aulas: aulasFormatadas      // Aplica as aulas formatadas
                    };
                });
                
                // Note que o objeto de retorno no MENSAGE deve ser 'atividades' (plural)
                return { ...MENSAGE.SUCCESS_REQUEST, atividades: atividadesFormatadas };
            } else {
                return MENSAGE.ERROR_NOT_FOUND
            }
        } else {
            return MENSAGE.ERROR_REQUIRED_FIELDS
        }
    } catch (error) {
        console.error("Erro em buscarAtividadePorInstituicao:", error)
        return MENSAGE.ERROR_INTERNAL_SERVER_SERVICES
    }
}


module.exports = {
    inserirAtividade,
    atualizarAtividade,
    excluirAtividade,
    listarTodasAtividades,
    buscarAtividade,
    buscarAtividadePorInstituicao
}