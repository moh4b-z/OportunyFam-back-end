const MENSAGE = require("../../../modulo/config");
const CORRECTION = require("../../../utils/inputCheck");
const TableCORRECTION = require("../../../utils/tablesCheck");

const generoDAO = require("../../../model/DAO/Genero/genero");

/////////////////////////insert//////////////////////////////////////
async function inserirGenero(genero, contentType) {
    try{
        if (contentType == "aplication/json"){
            if(TableCORRECTION.CHECK_tbl_genero(genero)){
                let result = await generoDAO.insertGenero(genero);

                if(result){
                    return{
                        ...MENSAGE.SUCCESS_CEATED_ITEM,
                        genero: result
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
async function atualizarGenero(genero, id, contentType) {
    try{
        if(contentType == "application/json"){
            if(TableCORRECTION.CHECK_tbl_genero(genero)&& CORRECTION.CHECK_ID(id)){
                let resultSearch = await buscarGenero(parseInt(id));

                if (resultSearch.status_code == 201){
                    genero.id_genero = parseInt(id);
                    let result = await generoDAO.updateGenero(genero);

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

async function excluirGenero(id) {
    try{
        if(CORRECTION.CHECK_ID(id)){
            let verification = await generoDAO.selectByIdGenero(parseInt(id));

            if (verification) {
                let result = await generoDAO.deleteGenero(parseInt(id));
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

async function listarTodosGenero() {
    try {
        let result = await generoDAO.selectAllGenero();

        if (result && result.length > 0) {
            return {
                status: true,
                status_code: 201,
                items: result.length,
                genero: result
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

async function buscarGenero(id) {
    try {
        if (CORRECTION.CHECK_ID(id)) {
            let result = await generoDAO.selectByIdGenero(parseInt(id));

            if (result) {
                return {
                    status: true,
                    status_code: 201,
                    genero: result
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
    inserirGenero,
    atualizarGenero,
    excluirGenero,
    listarTodosGenero,
    buscarGenero
};