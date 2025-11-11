const MENSAGE = require("../../modulo/config")
const CORRECTION = require("../../utils/inputCheck")
const encryptionFunction = require("../../utils/encryptionFunction")
const loginDAO = require("../../model/DAO/login")
const jwt = require('jsonwebtoken')
const { JWT_SECRET = 'your-secret-key', JWT_ACCESS_EXPIRES = '15m', JWT_REFRESH_EXPIRES = '7d' } = process.env



async function loginUniversal(dadosLogin, contentType) {
    try {
        if (contentType == "application/json") {

            if (dadosLogin.email && dadosLogin.senha) {
                
                // Envia a senha em texto para o DAO, que fará a verificação com a senha armazenada
                let result = await loginDAO.login(dadosLogin.email, dadosLogin.senha)
                let tipo = false

                if (result === 404){
                    return MENSAGE.ERROR_EMAIL_NOT_FOUND
                }
                if (result === 401){
                    return MENSAGE.ERROR_INVALID_CREDENTIALS
                }
                if (result.tipo) {
                    // Gera tokens JWT (access + refresh)
                    const user = result.usuario
                    // Identifica o id real (usuario_id | instituicao_id | crianca_id)
                    let subjectId = user.usuario_id || user.instituicao_id || user.crianca_id
                    
                    if(user.crianca_id){
                        user.idade = Number(user.idade)
                        
                    }

                    const payload = { id: subjectId, tipo: result.tipo, email: user.email }
                    const accessToken = jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_ACCESS_EXPIRES })
                    const refreshToken = jwt.sign({ id: subjectId }, JWT_SECRET, { expiresIn: JWT_REFRESH_EXPIRES })

                    return {
                        ...MENSAGE.SUCCESS_LOGIN,
                        tipo: result.tipo,
                        result: user,
                        accessToken,
                        refreshToken
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