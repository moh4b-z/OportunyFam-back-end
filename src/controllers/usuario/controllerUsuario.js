// src/controllers/usuario/controllerUsuario.js
const servicesUsuario = require("../../services/API/usuario/servicesUsuario")

const postUsuario = async (request, response) => {
    let contentType = request.headers['content-type']
    let dadosBody = request.body
    let result = await servicesUsuario.inserirUsuario(dadosBody, contentType)
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

const postLoginUsuario = async (request, response) => {
    let contentType = request.headers['content-type']
    let dadosBody = request.body
    let result = await servicesUsuario.loginUsuario(dadosBody, contentType)
    response.status(result.status_code)
    response.json(result)
}

module.exports = {
    postUsuario,
    putUsuario,
    deleteUsuario,
    getSearchAllUsuario,
    getSearchUsuario,
    postLoginUsuario
}