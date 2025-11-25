const MENSAGE = require("../../../../modulo/config")
const TableCORRECTION = require("../../../../utils/tablesCheck")
const CORRECTION = require("../../../../utils/inputCheck")
const aulaDAO = require("../../../../model/DAO/atividade/aula/aula")

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

async function buscarAula(id){
    try {
        if (CORRECTION.CHECK_ID(id)) {
            let result = await aulaDAO.selectByIdAula(parseInt(id))
            return result ? { ...MENSAGE.SUCCESS_REQUEST, aula: result } : MENSAGE.ERROR_NOT_FOUND
        } else {
            return MENSAGE.ERROR_REQUIRED_FIELDS
        }
    } catch (error) {
        console.error(error)
        return MENSAGE.ERROR_INTERNAL_SERVER_SERVICES
    }
}


async function listarTodasAulas() {
    try {
        let result = await aulaDAO.selectAllAulas();

        // Verificação antecipada: se não tem resultado, retorna erro ou vazio logo
        if (!result || result.length === 0) {
            return MENSAGE.ERROR_NOT_FOUND;
        }

        const aulasFormatadas = result.map(aula => {
            // Convertendo para objeto Date
            const dataInicio = new Date(aula.hora_inicio);
            const dataFim = new Date(aula.hora_fim);

            // Configurações para garantir o fuso de SP/Brasil e formato correto
            const timeZone = 'America/Sao_Paulo';

            return {
                ...aula,
                hora_inicio: aula.hora_inicio ? aula.hora_inicio.split('.')[0] : null, 
                hora_fim: aula.hora_fim ? aula.hora_fim.split('.')[0] : null
            };
        });

        return { ...MENSAGE.SUCCESS_REQUEST, aulas: aulasFormatadas };

    } catch (error) {
        console.error(error);
        return MENSAGE.ERROR_INTERNAL_SERVER_SERVICES;
    }
}

async function listarAulasPorInstituicao(idInstituicao) {
    try {
        // Verifica se o ID é válido antes de tudo
        if (!CORRECTION.CHECK_ID(idInstituicao)) {
            return MENSAGE.ERROR_REQUIRED_FIELDS;
        }

        let result = await aulaDAO.selectAulasByInstituicaoId(parseInt(idInstituicao));

        if (!result || result.length === 0) {
            return MENSAGE.ERROR_NOT_FOUND;
        }

        const aulasFormatadas = result.map(aula => {

            return {
                ...aula,
                hora_inicio: aula.hora_inicio ? aula.hora_inicio.split('.')[0] : null, 
                hora_fim: aula.hora_fim ? aula.hora_fim.split('.')[0] : null
            };
        });

        return { ...MENSAGE.SUCCESS_REQUEST, aulas: aulasFormatadas };

    } catch (error) {
        console.error(error);
        return MENSAGE.ERROR_INTERNAL_SERVER_SERVICES;
    }
}

async function inserirVariasAulas(dadosAulas, contentType) {
    try {
        if (contentType !== "application/json") {
            return MENSAGE.ERROR_CONTENT_TYPE
        }

        // Validação dos campos obrigatórios
        if (!dadosAulas.id_atividade || !dadosAulas.hora_inicio || !dadosAulas.hora_fim || 
            !dadosAulas.vagas_total || !dadosAulas.datas || !Array.isArray(dadosAulas.datas) || 
            dadosAulas.datas.length === 0) {
            return MENSAGE.ERROR_REQUIRED_FIELDS
        }

        const aulasInseridas = []
        const aulasComErro = []

        // Para cada data, cria uma aula
        for (const data_aula of dadosAulas.datas) {
            const dadosAula = {
                id_atividade: dadosAulas.id_atividade,
                data_aula,
                hora_inicio: dadosAulas.hora_inicio,
                hora_fim: dadosAulas.hora_fim,
                vagas_total: dadosAulas.vagas_total,
                vagas_disponiveis: dadosAulas.vagas_total // Inicialmente igual ao total
            }

            if (TableCORRECTION.CHECK_tbl_aulas_atividade(dadosAula)) {
                const result = await aulaDAO.insertAula(dadosAula)
                if (result) {
                    aulasInseridas.push(result)
                } else {
                    aulasComErro.push(data_aula)
                }
            } else {
                aulasComErro.push(data_aula)
            }
        }

        // Retorna resultado com aulas inseridas e erros, se houver
        return {
            ...MENSAGE.SUCCESS_CEATED_ITEM,
            aulas_inseridas: aulasInseridas,
            total_inseridas: aulasInseridas.length,
            erros: aulasComErro.length > 0 ? {
                total: aulasComErro.length,
                datas: aulasComErro
            } : null
        }
    } catch (error) {
        console.error(error)
        return MENSAGE.ERROR_INTERNAL_SERVER_SERVICES
    }
}

module.exports = {
    inserirAula,
    inserirVariasAulas,
    atualizarAula,
    excluirAula,
    buscarAula,
    listarTodasAulas,
    listarAulasPorInstituicao 
}