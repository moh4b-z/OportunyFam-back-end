const servicesCategoria = require("../../../services/API/atividade/categoria/servicesCategoria")

const postCategoria = async (request, response) => {
    let contentType = request.headers['content-type']
    let dadosBody = request.body
    let result = await servicesCategoria.inserirCategoria(dadosBody, contentType)
    response.status(result.status_code)
    response.json(result)
}

const getSearchAllCategorias = async (request, response) => {
    let result = await servicesCategoria.listarTodasCategorias()
    response.status(result.status_code)
    response.json(result)
}

const getSearchCategoria = async (request, response) => {
    let id = request.params.id
    let result = await servicesCategoria.buscarCategoria(id)
    response.status(result.status_code)
    response.json(result)
}

const deleteCategoria = async (request, response) => {
    let id = request.params.id
    let result = await servicesCategoria.excluirCategoria(id)
    response.status(result.status_code)
    response.json(result)
}

const putCategoria = async (request, response) => {
    let id = request.params.id
    let contentType = request.headers['content-type']
    let dadosBody = request.body
    let result = await servicesCategoria.atualizarCategoria(dadosBody, id, contentType)
    response.status(result.status_code)
    response.json(result)
}

module.exports = {
    postCategoria,
    putCategoria,
    deleteCategoria,
    getSearchAllCategorias,
    getSearchCategoria
}