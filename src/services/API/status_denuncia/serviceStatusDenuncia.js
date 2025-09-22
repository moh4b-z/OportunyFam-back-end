const MENSAGE = require("../../../modulo/config");
const CORRECTION = require("../../../utils/inputCheck");
const TableCORRECTION = require("../../../utils/tablesCheck");

const statusDenunciaDAO = require("../../../model/DAO/StatusDenuncia/statusDenuncia");

/////////////////////////insert//////////////////////////////////////
async function inserirStatusDenuncia(statusDenuncia, contentType) {
    try{
        if (contentType == "aplication/json"){
             //verificar tbl
            if(TableCORRECTION.CHECK_tbl_statusDenuncia(statusDenuncia)){
                let result = await statusDenunciaDAO.insertStatusDenuncia(statusDenuncia);

                if(result){
                    return{
                        ...MENSAGE.SUCCESS_CEATED_ITEM,
                        statusDenuncia: result
                    };
                } else{
                    return MENSAGE.ERROR_INTERNAL_SERVER_MODEL;
                }
            }else{
                return MENSAGE.ERROR_REQUIRED_FIELDS;
            }
        } else{
            return MENSAGE.ERROR_CONTENT_TYPE
        }
    }catch (error){
        return MENSAGE.ERROR_INTERNAL_SERVER_SERVICES
    }
}

/////////////////////////atualizar//////////////////////////////////////
async function atualizarStatusDenuncia(statusDenuncia, id, contentType) {
    try{
        if(contentType == "application/json"){
            if(TableCORRECTION.CHECK_tbl_statusDenuncia(statusDenuncia)&& CORRECTION.CHECK_ID(id)){
                let resultSearch = await buscarStatusDenuncia(parseInt(id));

                if (resultSearch.status_code == 201){
                    statusDenuncia.id_statusDenuncia = parseInt(id);
                    let result = await statusDenunciaDAO.updateStatusDenuncia(statusDenuncia);

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
async function excluirStatusDenuncia(id) {
    try{
        if(CORRECTION.CHECK_ID(id)){
            let verification = await statusDenunciaDAO.selectByIdStatusDenuncia(parseInt(id));

            if (verification) {
                let result = await statusDenunciaDAO.deleteStatusDenuncia(parseInt(id));
                return result ? MENSAGE.SUCCESS_DELETE_ITEM : MENSAGE.ERROR_NOT_DELETE;
            }else {
                 return MENSAGE.ERROR_NOT_FOUND;
            }
        }else {
            return MENSAGE.ERROR_REQUIRED_FIELDS;
        }
    }catch (error) {
       console.error(error);
        return MENSAGE.ERROR_INTERNAL_SERVER_SERVICES;
    }
}

/////////////////////////Listar//////////////////////////////////////
async function listarStatusDenuncia() {
    try {
        let result = await statusDenunciaDAO.selectAllStatusDenuncia();

        if (result && result.length > 0) {
            return {
                status: true,
                status_code: 201,
                items: result.length,
                statusDenuncia: result
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
async function buscarStatusDenuncia(id) {
    try {
        if (CORRECTION.CHECK_ID(id)) {
            let result = await statusDenunciaDAO.selectByIdStatusDenuncia(parseInt(id));

            if (result) {
                return {
                    status: true,
                    status_code: 201,
                    statusDenuncia: result
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
    inserirStatusDenuncia,
    atualizarStatusDenuncia,
    excluirStatusDenuncia,
    listarStatusDenuncia,
    buscarStatusDenuncia
};
