const MENSAGE = require("../../modulo/config");
const CORRECTION = require("../../utils/inputCheck");
const TableCORRECTION = require("../../utils/tablesCheck");

const tipoDocumentoDAO = require("../../model/DAO/TipoDocumento/tipoDocumento");

/////////////////////////insert//////////////////////////////////////
async function inserirTipoDocumento(tipoDocumento, contentType){
    try {
       if (contentType == "application/json") {
         //verificar tbl
            if (TableCORRECTION.CHECK_tbl_tipoDocumento(tipoDocumento)) {
                let result = await tipoDocumentoDAO.insertTipoDocumento(tipoDocumento);
        
                if (result) {
                    return {
                         ...MENSAGE.SUCCESS_CEATED_ITEM,
                           presenca: result
                    };
                } else {
                    return MENSAGE.ERROR_INTERNAL_SERVER_MODEL;
                 }
            } else {
              return MENSAGE.ERROR_REQUIRED_FIELDS;
            }
        } else {
           return MENSAGE.ERROR_CONTENT_TYPE;
        }
     } catch (error) {
        console.error(error);
                return MENSAGE.ERROR_INTERNAL_SERVER_SERVICES;
    }
}

/////////////////////////atualizar//////////////////////////////////////
async function atualizarTipoDocumento(tipoDocumento, id, contentType) {
    try{
        if(contentType == "application/json"){
            if(TableCORRECTION.CHECK_tbl_tipoDocumento(tipoDocumento)&& CORRECTION.CHECK_ID(id)){
                let resultSearch = await buscarTipoDocumento(parseInt(id));

                if (resultSearch.status_code == 201){
                    tipoDocumento.id_tipoDocumento = parseInt(id);
                    let result = await tipoDocumento.updateTipoDocumento(tipoDocumento);

                    return result ? MENSAGE.SUCCESS_UPDATED_ITEM : MENSAGE.ERROR_INTERNAL_SERVER_MODEL;
                }else if (resultSearch.status_code == 404){
                    return MENSAGE.ERROR_NOT_FOUND;
                }
            }else{
                return MENSAGE.ERROR_REQUIRED_FIELDS;
            }
        }else{
            return MENSAGE.ERROR_CONTENT_TYPE;
        }
    } catch(error){
        console.error(error);
        return MENSAGE.ERROR_INTERNAL_SERVER_SERVICES;
    }
}

/////////////////////////excluir//////////////////////////////////////
async function excluirTipoDocumento(id) {
    try {
        if (CORRECTION.CHECK_ID(id)) {
            let verification = await tipoDocumentoDAO.selectByIdTipoDocumento(parseInt(id));

            if (verification) {
                let result = await tipoDocumentoDAO.deleteTipoDocumento(parseInt(id));
                return result ? MENSAGE.SUCCESS_DELETE_ITEM : MENSAGE.ERROR_NOT_DELETE;
            } else {
                return MENSAGE.ERROR_NOT_FOUND;
            }
        } else {
            return MENSAGE.ERROR_REQUIRED_FIELDS;
        }
    } catch (error) {
        console.error(error);
        return MENSAGE.ERROR_INTERNAL_SERVER_SERVICES;
    }
}

/////////////////////////Listar//////////////////////////////////////
async function listarTipoDocumento() {
    try {
        let result = await tipoDocumentoDAO.selectAllTipoDocumento();

        if (result && result.length > 0) {
            return {
                status: true,
                status_code: 201,
                items: result.length,
                tipoDocumento: result
            };
        } else {
            return MENSAGE.ERROR_NOT_FOUND;
        }
    } catch (error) {
        console.error(error);
        return MENSAGE.ERROR_INTERNAL_SERVER_SERVICES;
    }
}

/////////////////////////buscar por id//////////////////////////////////////
async function buscarTipoDocumento(id) {
    try {
        if (CORRECTION.CHECK_ID(id)) {
            let result = await tipoDocumentoDAO.selectByIdTipoDocumento(parseInt(id));

            if (result) {
                return {
                    status: true,
                    status_code: 201,
                    tipoDocumento: result
                };
            } else {
                return MENSAGE.ERROR_NOT_FOUND;
            }
        } else {
            return MENSAGE.ERROR_REQUIRED_FIELDS;
        }
    } catch (error) {
        console.error(error);
        return MENSAGE.ERROR_INTERNAL_SERVER_SERVICES;
    }
}
module.exports = {
    inserirTipoDocumento,
    atualizarTipoDocumento,
    excluirTipoDocumento,
    listarTipoDocumento,
    buscarTipoDocumento
};
