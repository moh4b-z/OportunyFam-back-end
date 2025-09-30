const servicesResponsavel = require("../../../services/API/usuario/responsavel/servicesResponsavel")

const postResponsavel = async (request, response) => {
    let contentType = request.headers['content-type']
    let dadosBody = request.body
    let result = await servicesResponsavel.inserirResponsavel(dadosBody, contentType)
    response.status(result.status_code)
    response.json(result)
}

const deleteResponsavel = async (request, response) => {
    let id = request.params.id
    let result = await servicesResponsavel.excluirResponsavel(id)
    response.status(result.status_code)
    response.json(result)
}

const getSearchAllResponsavel = async (request, response) => {
    let result = await servicesResponsavel.listarTodosResponsaveis()
    response.status(result.status_code)
    response.json(result)
}

const getSearchResponsavel = async (request, response) => {
    let id = request.params.id
    let result = await servicesResponsavel.buscarResponsavel(id)
    response.status(result.status_code)
    response.json(result)
}

module.exports = {
    postResponsavel,
    deleteResponsavel,
    getSearchAllResponsavel,
    getSearchResponsavel
}