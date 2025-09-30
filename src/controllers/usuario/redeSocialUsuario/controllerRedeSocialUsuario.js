// src/controllers/redeSocialUsuario/controllerRedeSocialUsuario.js

const servicesRedeSocialUsuario = require("../../services/API/redeSocialUsuario/servicesRedeSocialUsuario")

const postRedeSocialUsuario = async (request, response) => {
    let contentType = request.headers['content-type']
    let dadosBody = request.body
    let result = await servicesRedeSocialUsuario.inserirRedeSocialUsuario(dadosBody, contentType)
    response.status(result.status_code)
    response.json(result)
}

const putRedeSocialUsuario = async (request, response) => {
    let id = request.params.id
    let contentType = request.headers['content-type']
    let dadosBody = request.body
    let result = await servicesRedeSocialUsuario.atualizarRedeSocialUsuario(dadosBody, id, contentType)
    response.status(result.status_code)
    response.json(result)
}

const deleteRedeSocialUsuario = async (request, response) => {
    let id = request.params.id
    let result = await servicesRedeSocialUsuario.excluirRedeSocialUsuario(id)
    response.status(result.status_code)
    response.json(result)
}

const getSearchAllRedeSocialUsuario = async (request, response) => {
    let result = await servicesRedeSocialUsuario.listarTodasRedesSociaisUsuario()
    response.status(result.status_code)
    response.json(result)
}

const getSearchRedeSocialUsuario = async (request, response) => {
    let id = request.params.id
    let result = await servicesRedeSocialUsuario.buscarRedeSocialUsuario(id)
    response.status(result.status_code)
    response.json(result)
}

module.exports = {
    postRedeSocialUsuario,
    putRedeSocialUsuario,
    deleteRedeSocialUsuario,
    getSearchAllRedeSocialUsuario,
    getSearchRedeSocialUsuario
}