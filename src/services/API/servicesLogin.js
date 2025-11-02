const MENSAGE = require("../../modulo/config")
const CORRECTION = require("../../utils/inputCheck")
const encryptionFunction = require("../../utils/encryptionFunction")
const loginDAO = require("../../model/DAO/login")



async function loginUniversal(dadosLogin, contentType) {
    try {
        if (contentType == "application/json") {

            if (dadosLogin.email && dadosLogin.senha) {
                
                let senha = encryptionFunction.hashPassword(dadosLogin.senha)
                let result = await loginDAO.login(dadosLogin.email, senha)
                let tipo = false

                if (result === 404){
                    return MENSAGE.ERROR_EMAIL_NOT_FOUND
                }
                if (result === 401){
                    return MENSAGE.ERROR_INVALID_CREDENTIALS
                }
                if (result.tipo) {

                    return {
                        ...MENSAGE.SUCCESS_LOGIN,
                        tipo: result.tipo,
                        result: result.usuario
                    }
                } else {
                    
                    return MENSAGE.ERROR_INVALID_CREDENTIALS
                }
            } else {
                return MENSAGE.ERROR_REQUIRED_FIELDS
            }
        } else {
            return MENSAGE.ERROR_CONTENT_TYPE
        }
    } catch (error) {
        console.error("Erro SERVICE: Erro ao realizar login universal.", error)
        return MENSAGE.ERROR_INTERNAL_SERVER_SERVICES
    }
}


module.exports = {
    loginUniversal
}