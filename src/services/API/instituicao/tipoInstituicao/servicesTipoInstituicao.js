const MENSAGE = require("../../../../modulo/config")
const CORRECTION = require("../../../../utils/inputCheck")
const tipoInstituicaoDAO = require("../../../../model/DAO/instituicao/tipoInstituicao/tipoInstituicao")

async function inserirTipoInstituicao(dadosTipo, contentType){
    try {
        if (contentType == "application/json") {
            if (dadosTipo.nome) {
                
                let result = await tipoInstituicaoDAO.insertTipoInstituicao(dadosTipo)
                
                return result ? {
                    ...MENSAGE.SUCCESS_CEATED_ITEM,
                    tipo_instituicao: result
                } : MENSAGE.ERROR_INTERNAL_SERVER_MODEL
                
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

async function atualizarTipoInstituicao(dadosTipo, id, contentType){
    try {
        if (contentType == "application/json") {
            if (CORRECTION.CHECK_ID(id) && dadosTipo.nome) {
                
                let resultSearch = await buscarTipoInstituicao(parseInt(id))
                
                if (resultSearch.status_code == MENSAGE.SUCCESS_REQUEST.status_code) {
                    
                    dadosTipo.id = parseInt(id)
                    let result = await tipoInstituicaoDAO.updateTipoInstituicao(dadosTipo)
                    
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

async function excluirTipoInstituicao(id){
    try {
        if (CORRECTION.CHECK_ID(id)) {
            let resultSearch = await buscarTipoInstituicao(parseInt(id))
            
            if (resultSearch.status_code == MENSAGE.SUCCESS_REQUEST.status_code) {
                
                let result = await tipoInstituicaoDAO.deleteTipoInstituicao(parseInt(id))
                
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

async function listarTodosTipoInstituicao(){
    try {
        let result = await tipoInstituicaoDAO.selectAllTipoInstituicao()

        // console.log(MENSAGE.SUCCESS_REQUEST );
        
        if (result) {
            return result.length > 0 ? { ...MENSAGE.SUCCESS_REQUEST, tipos_instituicao: result } : MENSAGE.ERROR_NOT_FOUND
        } else {
            return MENSAGE.ERROR_INTERNAL_SERVER_MODEL
        }
    } catch (error) {
        console.error(error)
        return MENSAGE.ERROR_INTERNAL_SERVER_SERVICES
    }
}

async function buscarTipoInstituicao(id){
    try {
        if (CORRECTION.CHECK_ID(id)) {
            let result = await tipoInstituicaoDAO.selectByIdTipoInstituicao(parseInt(id))
            
            return result ? { ...MENSAGE.SUCCESS_REQUEST, tipo_instituicao: result } : MENSAGE.ERROR_NOT_FOUND
        } else {
            return MENSAGE.ERROR_REQUIRED_FIELDS
        }
    } catch (error) {
        console.error(error)
        return MENSAGE.ERROR_INTERNAL_SERVER_SERVICES
    }
}

module.exports = {
    inserirTipoInstituicao,
    atualizarTipoInstituicao,
    excluirTipoInstituicao,
    listarTodosTipoInstituicao,
    buscarTipoInstituicao
}