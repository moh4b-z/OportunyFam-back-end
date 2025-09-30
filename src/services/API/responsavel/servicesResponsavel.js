const MENSAGE = require("../../../modulo/config")
const CORRECTION = require("../../../utils/inputCheck")
const responsavelDAO = require("../../../model/DAO/responsavel/responsavel")
const usuarioDAO = require("../../../model/DAO/usuario/usuario")
const criancaDAO = require("../../../model/DAO/crianca/crianca")

async function inserirResponsavel(dadosResponsavel, contentType) {
    try {
        if (contentType == "application/json") {
            const { id_usuario, id_crianca } = dadosResponsavel
            
            if (CORRECTION.CHECK_ID(id_usuario) && CORRECTION.CHECK_ID(id_crianca)) {
                
                // 1. Verificar se a relação já existe
                let relacaoExistente = await responsavelDAO.selectByUsuarioECrianca(parseInt(id_usuario), parseInt(id_crianca))
                if (relacaoExistente) {
                    return MENSAGE.ERROR_RELATIONSHIP_ALREADY_EXISTS // Adicione esta mensagem no seu config.js
                }

                // 2. Verificar se o Usuário e a Criança existem (integridade referencial)
                let usuarioExiste = await usuarioDAO.selectByIdUsuario(parseInt(id_usuario))
                let criancaExiste = await criancaDAO.selectByIdCrianca(parseInt(id_crianca))

                if (!usuarioExiste || !criancaExiste) {
                    return MENSAGE.ERROR_FOREIGN_KEY // Adicione esta mensagem no seu config.js (ID(s) não encontrado(s))
                }
                
                let result = await responsavelDAO.insertResponsavel(dadosResponsavel)
                return result ? { ...MENSAGE.SUCCESS_CEATED_ITEM, responsavel: result } : MENSAGE.ERROR_INTERNAL_SERVER_MODEL
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

async function excluirResponsavel(id) {
    try {
        if (CORRECTION.CHECK_ID(id)) {
            let resultSearch = await buscarResponsavel(parseInt(id))
            if (resultSearch.status_code == MENSAGE.SUCCESS_REQUEST.status_code) {
                let result = await responsavelDAO.deleteResponsavel(parseInt(id))
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

async function listarTodosResponsaveis() {
    try {
        let result = await responsavelDAO.selectAllResponsaveis()
        if (result) {
            // Retornamos apenas a relação, se precisar de detalhes, podemos criar uma view
            return result.length > 0 ? { ...MENSAGE.SUCCESS_REQUEST, responsaveis: result } : MENSAGE.ERROR_NOT_FOUND
        } else {
            return MENSAGE.ERROR_INTERNAL_SERVER_MODEL
        }
    } catch (error) {
        console.error(error)
        return MENSAGE.ERROR_INTERNAL_SERVER_SERVICES
    }
}

async function buscarResponsavel(id) {
    try {
        if (CORRECTION.CHECK_ID(id)) {
            let result = await responsavelDAO.selectByIdResponsavel(parseInt(id))
            return result ? { ...MENSAGE.SUCCESS_REQUEST, responsavel: result } : MENSAGE.ERROR_NOT_FOUND
        } else {
            return MENSAGE.ERROR_REQUIRED_FIELDS
        }
    } catch (error) {
        console.error(error)
        return MENSAGE.ERROR_INTERNAL_SERVER_SERVICES
    }
}


module.exports = {
    inserirResponsavel,
    excluirResponsavel,
    listarTodosResponsaveis,
    buscarResponsavel
}