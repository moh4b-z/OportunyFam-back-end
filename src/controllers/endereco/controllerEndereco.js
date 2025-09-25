const servicesEndereco = require("../../services/API/endereco/servicesEndereco")

const postEndereco = async (request, response) => {
    let contentType = request.headers['content-type']
    let dadosBody = request.body
    let result = await servicesEndereco.inserirEndereco(dadosBody, contentType)
    response.status(result.status_code)
    response.json(result)
}

const getSearchAllEndereco = async (request, response) => {
    let result = await servicesEndereco.listarTodosEnderecos()
    response.status(result.status_code)
    response.json(result)
}

const getSearchEndereco = async (request, response) => {
    let id = request.params.id
    let result = await servicesEndereco.buscarEndereco(id)
    response.status(result.status_code)
    response.json(result)
}

const deleteEndereco = async (request, response) => {
    let id = request.params.id
    let result = await servicesEndereco.excluirEndereco(id)
    response.status(result.status_code)
    response.json(result)
}

const putEndereco = async (request, response) => {
    let id = request.params.id
    let contentType = request.headers['content-type']
    let dadosBody = request.body
    let result = await servicesEndereco.atualizarEndereco(dadosBody, id, contentType)
    response.status(result.status_code)
    response.json(result)
}

module.exports = {
    postEndereco,
    putEndereco,
    deleteEndereco,
    getSearchAllEndereco,
    getSearchEndereco
}