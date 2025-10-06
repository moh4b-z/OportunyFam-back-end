// src/controllers/sexo/controllerSexo.js
const servicesSexo = require("../../services/API/sexo/servicesSexo")

async function postSexo(request, response) {
    let contentType = request.headers['content-type']
    let dadosBody = request.body

    let result = await servicesSexo.inserirSexo(dadosBody, contentType)

    response.status(result.status_code)
    response.json(result)
}

async function getSearchAllSexo(request, response) {
    let result = await servicesSexo.listarTodosSexos()

    response.status(result.status_code)
    response.json(result)
}

async function getSearchSexo(request, response) {
    let id = request.params.id
    let result = await servicesSexo.buscarSexo(id)

    response.status(result.status_code)
    response.json(result)
}

async function deleteSexo(request, response) {
    let id = request.params.id
    let result = await servicesSexo.excluirSexo(id)

    response.status(result.status_code)
    response.json(result)
}

async function putSexo(request, response) {
    let id = request.params.id
    let contentType = request.headers['content-type']
    let dadosBody = request.body

    let result = await servicesSexo.atualizarSexo(dadosBody, id, contentType)

    response.status(result.status_code)
    response.json(result)
}

module.exports = {
    postSexo,
    putSexo,
    deleteSexo,
    getSearchAllSexo,
    getSearchSexo
}