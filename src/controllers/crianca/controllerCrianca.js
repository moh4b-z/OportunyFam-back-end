const servicesCrianca = require("../../services/API/crianca/servicesCrianca")

const postCrianca = async (request, response) => {
    let contentType = request.headers['content-type']
    let dadosBody = request.body
    let result = await servicesCrianca.inserirCrianca(dadosBody, contentType)
    response.status(result.status_code)
    response.json(result)
}

const putCrianca = async (request, response) => {
    let id = request.params.id
    let contentType = request.headers['content-type']
    let dadosBody = request.body
    let result = await servicesCrianca.atualizarCrianca(dadosBody, id, contentType)
    response.status(result.status_code)
    response.json(result)
}

const deleteCrianca = async (request, response) => {
    let id = request.params.id
    let result = await servicesCrianca.excluirCrianca(id)
    response.status(result.status_code)
    response.json(result)
}

const getSearchAllCrianca = async (request, response) => {
    let result = await servicesCrianca.listarTodasCriancas()
    response.status(result.status_code)
    response.json(result)
}

const getSearchCrianca = async (request, response) => {
    let id = request.params.id
    let result = await servicesCrianca.buscarCrianca(id)
    response.status(result.status_code)
    response.json(result)
}

module.exports = {
    postCrianca,
    putCrianca,
    deleteCrianca,
    getSearchAllCrianca,
    getSearchCrianca
}