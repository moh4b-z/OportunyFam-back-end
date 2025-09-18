const MENSAGE = require("../../../modulo/config");
const CORRECTION = require("../../../utils/inputCheck");
const TableCORRECTION = require("../../../utils/tablesCheck");

const presencaDAO = require("../../../model/DAO/Presenca/presenca");

/////////////////////////insert//////////////////////////////////////
async function inserirPresenca(presenca, contentType){
    try {
       if (contentType == "application/json") {
         //verificar tbl
            if (TableCORRECTION.CHECK_tbl_presenca(presenca)) {
                let result = await presencaDAO.insertPresenca(presenca);
        
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
async function atualizarPresenca(presenca, id, contentType) {
    try{
        if(contentType == "application/json"){
            if(TableCORRECTION.CHECK_tbl_presenca(presenca)&& CORRECTION.CHECK_ID(id)){
                let resultSearch = await buscarPresenca(parseInt(id));

                if (resultSearch.status_code == 201){
                    presenca.id_presenca = parseInt(id);
                    let result = await presencaDAO.updatePresenca(presenca);

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

async function excluirPresenca(id) {
    try {
        if (CORRECTION.CHECK_ID(id)) {
            let verification = await presencaDAO.selectByIdPresenca(parseInt(id));

            if (verification) {
                let result = await presencaDAO.deletePresenca(parseInt(id));
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

async function listarPresenca() {
    try {
        let result = await presencaDAO.selectAllPresenca();

        if (result && result.length > 0) {
            return {
                status: true,
                status_code: 201,
                items: result.length,
                presenca: result
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

async function buscarPresenca(id) {
    try {
        if (CORRECTION.CHECK_ID(id)) {
            let result = await presencaDAO.selectByIdPresenca(parseInt(id));

            if (result) {
                return {
                    status: true,
                    status_code: 201,
                    presenca: result
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
    inserirPresenca,
    atualizarPresenca,
    excluirPresenca,
    listarPresenca,
    buscarPresenca
};