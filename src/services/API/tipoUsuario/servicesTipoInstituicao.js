const MENSAGE = require("../../../modulo/config");
const CORRECTION = require("../../../utils/inputCheck");
const TableCORRECTION = require("../../../utils/tablesCheck");

const tipoInstituicaoDAO = require("../../../model/DAO/TipoInstituicao/tipoInstituicao");

/////////////////////////insert//////////////////////////////////////
async function inserirTipoInstituicao(tipoInstituicao, contentType){
    try {
       if (contentType == "application/json") {
        //verificar tbl
            if (TableCORRECTION.CHECK_tbl_tipoInstituicao(presenca)) {
                let result = await tipoInstituicaoDAO.insertTipoInstituicao(tipoInstituicao);
        
                if (result) {
                    return {
                         ...MENSAGE.SUCCESS_CEATED_ITEM,
                           tipoInstituicao: result
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
async function atualizarTipoInstituicao(tipoInstituicao, id, contentType) {
    try{
        if(contentType == "application/json"){
            if(TableCORRECTION.CHECK_tbl_tipoInstituicao(tipoInstituicao)&& CORRECTION.CHECK_ID(id)){
                let resultSearch = await buscarTipoInstituicao(parseInt(id));

                if (resultSearch.status_code == 201){
                    TipoInstituicao.id_TipoInstituicao = parseInt(id);
                    let result = await tipoInstituicaoDAO.updateTipoInstituicao(tipoInstituicao);

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
async function excluirTipoInstituicao(id) {
    try {
        if (CORRECTION.CHECK_ID(id)) {
            let verification = await tipoInstituicaoDAO.selectByIdTipoInstituicao(parseInt(id));

            if (verification) {
                let result = await tipoInstituicaoDAO.deleteTipoInstituicao(parseInt(id));
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
async function listarTipoInstituicao() {
    try {
        let result = await tipoInstituicaoDAO.selectAllTipoInstituicao();

        if (result && result.length > 0) {
            return {
                status: true,
                status_code: 201,
                items: result.length,
                tipoInstituicao: result
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
async function buscarTipoInstituicao(id) {
    try {
        if (CORRECTION.CHECK_ID(id)) {
            let result = await tipoInstituicaoDAO.selectByIdTipoInstituicao(parseInt(id));

            if (result) {
                return {
                    status: true,
                    status_code: 201,
                    tipoInstituicao: result
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
    inserirTipoInstituicao ,
    atualizarTipoInstituicao,
    excluirTipoInstituicao,
    listarTipoInstituicao,
    buscarTipoInstituicao
};
