// src/controllers/tipoNivel/controllerTipoNivel.js
const servicesTipoNivel = require("../../services/API/tipoNivel/servicesTipoNivel")

const postTipoNivel = async (request, response) => {
    let contentType = request.headers['content-type']
    let dadosBody = request.body
    let result = await servicesTipoNivel.inserirTipoNivel(dadosBody, contentType)
    response.status(result.status_code)
    response.json(result)
}

const getSearchAllTipoNivel = async (request, response) => {
    let result = await servicesTipoNivel.listarTodosTiposNivel()
    response.status(result.status_code)
    response.json(result)
}

const getSearchTipoNivel = async (request, response) => {
    let id = request.params.id
    let result = await servicesTipoNivel.buscarTipoNivel(id)
    response.status(result.status_code)
    response.json(result)
}

const deleteTipoNivel = async (request, response) => {
    let id = request.params.id
    let result = await servicesTipoNivel.excluirTipoNivel(id)
    response.status(result.status_code)
    response.json(result)
}

const putTipoNivel = async (request, response) => {
    let id = request.params.id
    let contentType = request.headers['content-type']
    let dadosBody = request.body
    let result = await servicesTipoNivel.atualizarTipoNivel(dadosBody, id, contentType)
    response.status(result.status_code)
    response.json(result)
}

module.exports = {
    postTipoNivel,
    putTipoNivel,
    deleteTipoNivel,
    getSearchAllTipoNivel,
    getSearchTipoNivel
}