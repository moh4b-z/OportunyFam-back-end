const servicesRedeSocial = require("../../services/API/redeSocial/servicesRedeSocial")

const postRedeSocial = async (request, response) => {
    let contentType = request.headers['content-type']
    let dadosBody = request.body
    let result = await servicesRedeSocial.inserirRedeSocial(dadosBody, contentType)
    response.status(result.status_code)
    response.json(result)
}

const putRedeSocial = async (request, response) => {
    let id = request.params.id
    let contentType = request.headers['content-type']
    let dadosBody = request.body
    let result = await servicesRedeSocial.atualizarRedeSocial(dadosBody, id, contentType)
    response.status(result.status_code)
    response.json(result)
}

const deleteRedeSocial = async (request, response) => {
    let id = request.params.id
    let result = await servicesRedeSocial.excluirRedeSocial(id)
    response.status(result.status_code)
    response.json(result)
}

const getSearchAllRedeSocial = async (request, response) => {
    let result = await servicesRedeSocial.listarTodasRedesSociais()
    response.status(result.status_code)
    response.json(result)
}

const getSearchRedeSocial = async (request, response) => {
    let id = request.params.id
    let result = await servicesRedeSocial.buscarRedeSocial(id)
    response.status(result.status_code)
    response.json(result)
}

module.exports = {
    postRedeSocial,
    putRedeSocial,
    deleteRedeSocial,
    getSearchAllRedeSocial,
    getSearchRedeSocial
}