const MENSAGE = require("../../../modulo/config")
const CORRECTION = require("../../../utils/inputCheck")
const TableCORRECTION = require("../../../utils/tablesCheck")
const redeSocialUsuarioDAO = require("../../../model/DAO/usuario/redeSocialUsuario/redeSocialUsuario")
const usuarioDAO = require("../../../model/DAO/usuario/usuario")
const redeSocialDAO = require("../../../model/DAO/redeSocial/redeSocial")

async function inserirRedeSocialUsuario(dadosRelacao, contentType) {
    try {
        if (contentType == "application/json") {
            if (TableCORRECTION.CHECK_tbl_rede_social_usuario(dadosRelacao)) {
                
                const { id_usuario, id_rede_social } = dadosRelacao

                // 1. Verificar se o Usuário e a Rede Social existem
                let usuarioExiste = await usuarioDAO.selectByIdUsuario(parseInt(id_usuario))
                let redeSocialExiste = await redeSocialDAO.selectByIdRedeSocial(parseInt(id_rede_social))
                
                if (!usuarioExiste || !redeSocialExiste) {
                    return MENSAGE.ERROR_FOREIGN_KEY 
                }

                // 2. Verificar se a relação já existe (usuário só pode ter um link por rede social)
                let relacaoExistente = await redeSocialUsuarioDAO.selectByUsuarioAndRedeSocial(parseInt(id_usuario), parseInt(id_rede_social))
                if (relacaoExistente) {
                    return MENSAGE.ERROR_RELATIONSHIP_ALREADY_EXISTS 
                }

                let result = await redeSocialUsuarioDAO.insertRedeSocialUsuario(dadosRelacao)
                return result ? { ...MENSAGE.SUCCESS_CEATED_ITEM, rede_social_usuario: result } : MENSAGE.ERROR_INTERNAL_SERVER_MODEL
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

async function atualizarRedeSocialUsuario(dadosRelacao, id, contentType) {
    try {
        if (contentType == "application/json") {
            // NOTE: A validação aqui checa se os IDs de fk estão presentes, embora apenas o ID da relação seja necessário para o WHERE
            if (TableCORRECTION.CHECK_tbl_rede_social_usuario(dadosRelacao) && CORRECTION.CHECK_ID(id)) {
                let resultSearch = await buscarRedeSocialUsuario(parseInt(id))

                if (resultSearch.status_code == MENSAGE.SUCCESS_REQUEST.status_code) {
                    // Mantemos o id_usuario e id_rede_social originais se não forem fornecidos,
                    // mas como a relação é única, não permitiremos a alteração da FK aqui.
                    // O usuário deve deletar e recriar se a FK for mudar.

                    dadosRelacao.id = parseInt(id)
                    let result = await redeSocialUsuarioDAO.updateRedeSocialUsuario(dadosRelacao)
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

async function excluirRedeSocialUsuario(id) {
    try {
        if (CORRECTION.CHECK_ID(id)) {
            let resultSearch = await buscarRedeSocialUsuario(parseInt(id))
            if (resultSearch.status_code == MENSAGE.SUCCESS_REQUEST.status_code) {
                let result = await redeSocialUsuarioDAO.deleteRedeSocialUsuario(parseInt(id))
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

async function listarTodasRedesSociaisUsuario() {
    try {
        let result = await redeSocialUsuarioDAO.selectAllRedesSociaisUsuario()
        if (result) {
            return result.length > 0 ? { ...MENSAGE.SUCCESS_REQUEST, redes_sociais_usuario: result } : MENSAGE.ERROR_NOT_FOUND
        } else {
            return MENSAGE.ERROR_INTERNAL_SERVER_MODEL
        }
    } catch (error) {
        console.error(error)
        return MENSAGE.ERROR_INTERNAL_SERVER_SERVICES
    }
}

async function buscarRedeSocialUsuario(id) {
    try {
        if (CORRECTION.CHECK_ID(id)) {
            let result = await redeSocialUsuarioDAO.selectByIdRedeSocialUsuario(parseInt(id))
            return result ? { ...MENSAGE.SUCCESS_REQUEST, rede_social_usuario: result } : MENSAGE.ERROR_NOT_FOUND
        } else {
            return MENSAGE.ERROR_REQUIRED_FIELDS
        }
    } catch (error) {
        console.error(error)
        return MENSAGE.ERROR_INTERNAL_SERVER_SERVICES
    }
}

module.exports = {
    inserirRedeSocialUsuario,
    atualizarRedeSocialUsuario,
    excluirRedeSocialUsuario,
    listarTodasRedesSociaisUsuario,
    buscarRedeSocialUsuario
}
