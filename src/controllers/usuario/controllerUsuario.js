const servicesUsuario = require("../../services/API/usuario/servicesUsuario")

const postUsuario = async (request, response) => {
    let contentType = request.headers['content-type']
    let dadosBody = request.body
    let result = await servicesUsuario.inserirUsuario(dadosBody, contentType)
    // Se service retornou refreshToken, setar cookie HttpOnly
    if (result && result.refreshToken) {
        response.cookie('refreshToken', result.refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            maxAge: 1000 * 60 * 60 * 24 * 7
        })
        const { refreshToken, ...body } = result
        response.status(body.status_code)
        response.json(body)
        return
    }

    response.status(result.status_code)
    response.json(result)
}

const putUsuario = async (request, response) => {
    let id = request.params.id
    let contentType = request.headers['content-type']
    let dadosBody = request.body
    let result = await servicesUsuario.atualizarUsuario(dadosBody, id, contentType)
    response.status(result.status_code)
    response.json(result)
}

const deleteUsuario = async (request, response) => {
    let id = request.params.id
    let result = await servicesUsuario.excluirUsuario(id)
    response.status(result.status_code)
    response.json(result)
}

const getSearchAllUsuario = async (request, response) => {
    let result = await servicesUsuario.listarTodosUsuarios()
    response.status(result.status_code)
    response.json(result)
}

const getSearchUsuario = async (request, response) => {
    let id = request.params.id
    let result = await servicesUsuario.buscarUsuario(id)
    response.status(result.status_code)
    response.json(result)
}

module.exports = {
    postUsuario,
    putUsuario,
    deleteUsuario,
    getSearchAllUsuario,
    getSearchUsuario
}