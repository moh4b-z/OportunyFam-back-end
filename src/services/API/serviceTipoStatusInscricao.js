const MENSAGE = require("../../modulo/config");
const CORRECTION = require("../../utils/inputCheck");
const TableCORRECTION = require("../../utils/tablesCheck");

const statusInscricaoDAO = require("../../model/DAO/StatusInscricao/statusInscricao");

/////////////////////////insert//////////////////////////////////////
async function inserirStatusInscricao(statusInscricao, contentType){
    try {
       if (contentType == "application/json") {
         //verificar tbl
            if (TableCORRECTION.CHECK_tbl_presenca(presenca)) {
                let result = await statusInscricaoDAO.insertStatusInscricao(statusInscricao);
        
                if (result) {
                    return {
                         ...MENSAGE.SUCCESS_CEATED_ITEM,
                         statusInscricao: result
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
async function atualizarStatusInscricao(statusInscricao, id, contentType) {
    try{
        if(contentType == "application/json"){
            if(TableCORRECTION.CHECK_tbl_statusInscricao(statusInscricao)&& CORRECTION.CHECK_ID(id)){
                let resultSearch = await buscarStatusInscricao(parseInt(id));

                if (resultSearch.status_code == 201){
                    statusInscricao.id_statusInscricao = parseInt(id);
                    let result = await statusInscricaoDAO.updateStatusInscricao(statusInscricao);

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
async function excluirStatusInscricao(id) {
    try {
        if (CORRECTION.CHECK_ID(id)) {
            let verification = await statusInscricaoDAO.selectByIdStatusInscricao(parseInt(id));

            if (verification) {
                let result = await statusInscricaoDAO.deleteStatusInscricao(parseInt(id));
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
async function listarStatusInscricao() {
    try {
        let result = await statusInscricaoDAO.selectAllStatusInscricao();

        if (result && result.length > 0) {
            return {
                status: true,
                status_code: 201,
                items: result.length,
                statusInscricao: result
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
async function buscarStatusInscricao(id) {
    try {
        if (CORRECTION.CHECK_ID(id)) {
            let result = await statusInscricaoDAO.selectByIdStatusInscricao(parseInt(id));

            if (result) {
                return {
                    status: true,
                    status_code: 201,
                    statusInscricao: result
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
    inserirStatusInscricao,
    atualizarStatusInscricao,
    excluirStatusInscricao,
    listarStatusInscricao,
    buscarStatusInscricao
};
