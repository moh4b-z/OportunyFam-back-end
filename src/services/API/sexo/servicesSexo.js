const MENSAGE = require("../../../modulo/config")
const CORRECTION = require("../../../utils/inputCheck")
const TableCORRECTION = require("../../../utils/tablesCheck")
const sexoDAO = require("../../../model/DAO/sexo/sexo")

async function inserirSexo(dadosSexo, contentType) {
    try {
        if (contentType === 'application/json') {
            if (!dadosSexo.nome || dadosSexo.nome.length > 50) {
                return MENSAGE.ERROR_REQUIRED_FIELDS
            }

            let result = await sexoDAO.insertSexo(dadosSexo)
            if (result) {
                return {
                    ...MENSAGE.SUCCESS_CEATED_ITEM,
                    sexo: result
                }
            } else {
                return MENSAGE.ERROR_INTERNAL_SERVER_MODEL
            }
        } else {
            return MENSAGE.ERROR_CONTENT_TYPE
        }
    } catch (error) {
        console.error(error)
        return MENSAGE.ERROR_INTERNAL_SERVER_SERVICES
    }
}

async function atualizarSexo(dadosSexo, id, contentType) {
    try {
        if (contentType === 'application/json') {
            if (!id || !dadosSexo.nome || dadosSexo.nome.length > 50) {
                return MENSAGE.ERROR_REQUIRED_FIELDS
            }

            let sexoExistente = await sexoDAO.selectByIdSexo(parseInt(id))
            if (!sexoExistente) {
                return MENSAGE.ERROR_NOT_FOUND
            }

            dadosSexo.id = parseInt(id)
            let result = await sexoDAO.updateSexo(dadosSexo)
            if (result) {
                return MENSAGE.SUCCESS_UPDATED_ITEM
            } else {
                return MENSAGE.ERROR_INTERNAL_SERVER_MODEL
            }
        } else {
            return MENSAGE.ERROR_CONTENT_TYPE
        }
    } catch (error) {
        console.error(error)
        return MENSAGE.ERROR_INTERNAL_SERVER_SERVICES
    }
}

async function excluirSexo(id) {
    try {
        if (!id) {
            return MENSAGE.ERROR_REQUIRED_FIELDS
        }

        let sexoExistente = await sexoDAO.selectByIdSexo(parseInt(id))
        if (!sexoExistente) {
            return MENSAGE.ERROR_NOT_FOUND
        }

        let result = await sexoDAO.deleteSexo(parseInt(id))
        if (result) {
            return MENSAGE.SUCCESS_DELETE_ITEM
        } else {
            return MENSAGE.ERROR_NOT_DELETE
        }
    } catch (error) {
        console.error(error)
        return MENSAGE.ERROR_INTERNAL_SERVER_SERVICES
    }
}

async function listarTodosSexos() {
    try {
        let result = await sexoDAO.selectAllSexo()

        if (result) {
            if (result.length > 0) {
                return {
                    ...MENSAGE.SUCCESS_REQUEST,
                    sexos: result
                }
            } else {
                return MENSAGE.ERROR_NOT_FOUND
            }
        } else {
            return MENSAGE.ERROR_INTERNAL_SERVER_MODEL
        }
    } catch (error) {
        console.error(error)
        return MENSAGE.ERROR_INTERNAL_SERVER_SERVICES
    }
}

async function buscarSexo(id) {
    try {
        if (!id) {
            return MENSAGE.ERROR_REQUIRED_FIELDS
        }

        let result = await sexoDAO.selectByIdSexo(parseInt(id))
        if (result) {
            return {
                ...MENSAGE.SUCCESS_REQUEST,
                sexo: result
            }
        } else {
            return MENSAGE.ERROR_NOT_FOUND
        }
    } catch (error) {
        console.error(error)
        return MENSAGE.ERROR_INTERNAL_SERVER_SERVICES
    }
}

module.exports = {
    inserirSexo,
    atualizarSexo,
    excluirSexo,
    listarTodosSexos,
    buscarSexo
}