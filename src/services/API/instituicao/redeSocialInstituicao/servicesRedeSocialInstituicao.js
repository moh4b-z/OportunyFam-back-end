// src/services/API/redeSocialInstituicao/servicesRedeSocialInstituicao.js

const MENSAGE = require("../../../modulo/config")
const CORRECTION = require("../../../utils/inputCheck")
const TableCORRECTION = require("../../../utils/tablesCheck")
const redeSocialInstituicaoDAO = require("../../../model/DAO/instituicao/redeSocialInstituicao/redeSocialInstituicao")
const instituicaoDAO = require("../../../model/DAO/instituicao/instituicao")
const redeSocialDAO = require("../../../model/DAO/redeSocial/redeSocial")

async function inserirRedeSocialInstituicao(dadosRelacao, contentType) {
    try {
        if (contentType == "application/json") {
            if (TableCORRECTION.CHECK_tbl_rede_social_instituicao(dadosRelacao)) {
                
                const { id_instituicao, id_rede_social } = dadosRelacao

                // 1. Verificar se a Instituição e a Rede Social existem
                let instituicaoExiste = await instituicaoDAO.selectByIdInstituicao(parseInt(id_instituicao))
                let redeSocialExiste = await redeSocialDAO.selectByIdRedeSocial(parseInt(id_rede_social))
                
                if (!instituicaoExiste || !redeSocialExiste) {
                    return MENSAGE.ERROR_FOREIGN_KEY 
                }

                // 2. Verificar se a relação já existe
                let relacaoExistente = await redeSocialInstituicaoDAO.selectByInstituicaoAndRedeSocial(parseInt(id_instituicao), parseInt(id_rede_social))
                if (relacaoExistente) {
                    return MENSAGE.ERROR_RELATIONSHIP_ALREADY_EXISTS 
                }

                let result = await redeSocialInstituicaoDAO.insertRedeSocialInstituicao(dadosRelacao)
                return result ? { ...MENSAGE.SUCCESS_CEATED_ITEM, rede_social_instituicao: result } : MENSAGE.ERROR_INTERNAL_SERVER_MODEL
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

async function atualizarRedeSocialInstituicao(dadosRelacao, id, contentType) {
    try {
        if (contentType == "application/json") {
            if (TableCORRECTION.CHECK_tbl_rede_social_instituicao(dadosRelacao) && CORRECTION.CHECK_ID(id)) {
                let resultSearch = await buscarRedeSocialInstituicao(parseInt(id))

                if (resultSearch.status_code == MENSAGE.SUCCESS_REQUEST.status_code) {
                    
                    // Nota: Não é necessário revalidar FKs aqui, pois se elas mudassem,
                    // a relação deveria ser deletada e recriada.

                    dadosRelacao.id = parseInt(id)
                    let result = await redeSocialInstituicaoDAO.updateRedeSocialInstituicao(dadosRelacao)
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

async function excluirRedeSocialInstituicao(id) {
    try {
        if (CORRECTION.CHECK_ID(id)) {
            let resultSearch = await buscarRedeSocialInstituicao(parseInt(id))
            if (resultSearch.status_code == MENSAGE.SUCCESS_REQUEST.status_code) {
                let result = await redeSocialInstituicaoDAO.deleteRedeSocialInstituicao(parseInt(id))
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

async function listarTodasRedesSociaisInstituicao() {
    try {
        let result = await redeSocialInstituicaoDAO.selectAllRedesSociaisInstituicao()
        if (result) {
            return result.length > 0 ? { ...MENSAGE.SUCCESS_REQUEST, redes_sociais_instituicao: result } : MENSAGE.ERROR_NOT_FOUND
        } else {
            return MENSAGE.ERROR_INTERNAL_SERVER_MODEL
        }
    } catch (error) {
        console.error(error)
        return MENSAGE.ERROR_INTERNAL_SERVER_SERVICES
    }
}

async function buscarRedeSocialInstituicao(id) {
    try {
        if (CORRECTION.CHECK_ID(id)) {
            let result = await redeSocialInstituicaoDAO.selectByIdRedeSocialInstituicao(parseInt(id))
            return result ? { ...MENSAGE.SUCCESS_REQUEST, rede_social_instituicao: result } : MENSAGE.ERROR_NOT_FOUND
        } else {
            return MENSAGE.ERROR_REQUIRED_FIELDS
        }
    } catch (error) {
        console.error(error)
        return MENSAGE.ERROR_INTERNAL_SERVER_SERVICES
    }
}

module.exports = {
    inserirRedeSocialInstituicao,
    atualizarRedeSocialInstituicao,
    excluirRedeSocialInstituicao,
    listarTodasRedesSociaisInstituicao,
    buscarRedeSocialInstituicao
}