const MENSAGE = require("../../../modulo/config");
const CORRECTION = require("../../../utils/inputCheck");
const TableCORRECTION = require("../../../utils/tablesCheck");

const tipoUsuarioDAO = require("../../../model/DAO/TipoUsuario/tipoUsuario");

/////////////////////////insert//////////////////////////////////////
async function inserirTipoUsuario(tipoUsuario, contentType){
    try {
       if (contentType == "application/json") {
         //verificar tbl
            if (TableCORRECTION.CHECK_tbl_tipoUsuario(tipoUsuario)) {
                let result = await tipoUsuarioDAO.insertTipoUsuario(tipoUsuario);
        
                if (result) {
                    return {
                         ...MENSAGE.SUCCESS_CEATED_ITEM,
                         tipoUsuario: result
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
async function atualizarTipoUsuario(tipoUsuario, id, contentType) {
    try{
        if(contentType == "application/json"){
            if(TableCORRECTION.CHECK_tbl_tipoUsuario(tipoUsuario)&& CORRECTION.CHECK_ID(id)){
                let resultSearch = await buscarTipoUsuario(parseInt(id));

                if (resultSearch.status_code == 201){
                    tipoUsuario.id_tipoUsuario = parseInt(id);
                    let result = await tipoUsuario.updateTipoUsuario(tipoUsuario);

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
async function excluirTipoUsuario(id) {
    try {
        if (CORRECTION.CHECK_ID(id)) {
            let verification = await tipoUsuarioDAO.selectByIdTipoUsuario(parseInt(id));

            if (verification) {
                let result = await tipoUsuarioDAO.deleteTipoUsuario(parseInt(id));
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
async function listarTipoUsuario() {
    try {
        let result = await tipoUsuarioDAO.selectAllTipoUsuario();

        if (result && result.length > 0) {
            return {
                status: true,
                status_code: 201,
                items: result.length,
                tipoUsuario: result
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
async function buscarTipoUsuario(id) {
    try {
        if (CORRECTION.CHECK_ID(id)) {
            let result = await tipoUsuarioDAO.selectByIdTipoUsuario(parseInt(id));

            if (result) {
                return {
                    status: true,
                    status_code: 201,
                    tipoUsuario: result
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
    inserirTipoUsuario,
    atualizarTipoUsuario,
    excluirTipoUsuario,
    listarTipoUsuario,
    buscarTipoUsuario
};
