const MENSAGE = require("../../../../modulo/config")
const TableCORRECTION = require("../../../../utils/tablesCheck")
const CORRECTION = require("../../../../utils/inputCheck")
const categoriaDAO = require("../../../../model/DAO/atividade/categoria/categoria")

async function inserirCategoria(dadosCategoria, contentType){
    try {
        if (contentType == "application/json") {
            if (TableCORRECTION.CHECK_tbl_categoria(dadosCategoria)) {
                let result = await categoriaDAO.insertCategoria(dadosCategoria)
                return result ? { ...MENSAGE.SUCCESS_CEATED_ITEM, categoria: result } : MENSAGE.ERROR_INTERNAL_SERVER_MODEL
            } else {
                return MENSAGE.ERROR_REQUIRED_FIELDS
            }
        } else {
            return MENSAGE.ERROR_CONTENT_TYPE
        }
    } catch (error) {
        console.error(error)
        // Possível erro de UNICIDADE (nome já existe)
        if (error.code === 'P2002') { 
             return MENSAGE.ERROR_DUPLICATE_ITEM
        }
        return MENSAGE.ERROR_INTERNAL_SERVER_SERVICES
    }
}

async function atualizarCategoria(dadosCategoria, id, contentType){
    try {
        if (contentType == "application/json") {
            if (TableCORRECTION.CHECK_tbl_categoria(dadosCategoria) && CORRECTION.CHECK_ID(id)) {
                
                let resultSearch = await buscarCategoria(parseInt(id))
                
                if (resultSearch.status_code == MENSAGE.SUCCESS_REQUEST.status_code) {
                    dadosCategoria.id = parseInt(id)
                    let result = await categoriaDAO.updateCategoria(dadosCategoria)
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
        if (error.code === 'P2002') { 
             return MENSAGE.ERROR_DUPLICATE_ITEM
        }
        return MENSAGE.ERROR_INTERNAL_SERVER_SERVICES
    }
}

async function excluirCategoria(id){
    try {
        if (CORRECTION.CHECK_ID(id)) {
            let resultSearch = await buscarCategoria(parseInt(id))
            
            if (resultSearch.status_code == MENSAGE.SUCCESS_REQUEST.status_code) {
                let result = await categoriaDAO.deleteCategoria(parseInt(id))
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
        // Erro de restrição de chave estrangeira (P2003) se houver atividades associadas
        if (error.code === 'P2003') { 
            return MENSAGE.ERROR_FOREIGN_KEY // Indica que não pode excluir por causa de dependências
        }
        return MENSAGE.ERROR_INTERNAL_SERVER_SERVICES
    }
}

async function listarTodasCategorias(){
    try {
        let result = await categoriaDAO.selectAllCategorias()
        if (result) {
            return result.length > 0 ? { ...MENSAGE.SUCCESS_REQUEST, categorias: result } : MENSAGE.ERROR_NOT_FOUND
        } else {
            return MENSAGE.ERROR_INTERNAL_SERVER_MODEL
        }
    } catch (error) {
        console.error(error)
        return MENSAGE.ERROR_INTERNAL_SERVER_SERVICES
    }
}

async function buscarCategoria(id){
    try {
        if (CORRECTION.CHECK_ID(id)) {
            let result = await categoriaDAO.selectByIdCategoria(parseInt(id))
            return result ? { ...MENSAGE.SUCCESS_REQUEST, categoria: result } : MENSAGE.ERROR_NOT_FOUND
        } else {
            return MENSAGE.ERROR_REQUIRED_FIELDS
        }
    } catch (error) {
        console.error(error)
        return MENSAGE.ERROR_INTERNAL_SERVER_SERVICES
    }
}

module.exports = {
    inserirCategoria,
    atualizarCategoria,
    excluirCategoria,
    listarTodasCategorias,
    buscarCategoria
}