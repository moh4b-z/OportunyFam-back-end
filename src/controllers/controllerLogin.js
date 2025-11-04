const servicesLogin = require("../services/API/servicesLogin")

const postLoginUniversal = async (request, response) => {
    let contentType = request.headers['content-type']
    let dadosBody = request.body
    let result = await servicesLogin.loginUniversal(dadosBody, contentType)
    // console.log(result);
    
    // Se o service retornou refreshToken e accessToken, setar cookie HttpOnly para refresh
    if (result && result.refreshToken) {
        // Configura cookie seguro quando em produção
        response.cookie('refreshToken', result.refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            maxAge: 1000 * 60 * 60 * 24 * 7 // 7 dias
        })
        // Não expor o refreshToken no body
        const { refreshToken, ...body } = result
        response.status(body.status_code)
        response.json(body)
        return
    }

    response.status(result.status_code)
    response.json(result)
}

module.exports = {
    postLoginUniversal
}