const servicesInstituicao = require("../../services/API/instituicao/servicesInstituicao")

const postInstituicao = async (request, response) => {
    let contentType = request.headers['content-type']
    let dadosBody = request.body
    let result = await servicesInstituicao.inserirInstituicao(dadosBody, contentType)
    response.status(result.status_code)
    response.json(result)
}

const putInstituicao = async (request, response) => {
    let id = request.params.id
    let contentType = request.headers['content-type']
    let dadosBody = request.body
    let result = await servicesInstituicao.atualizarInstituicao(dadosBody, id, contentType)
    response.status(result.status_code)
    response.json(result)
}

const deleteInstituicao = async (request, response) => {
    let id = request.params.id
    let result = await servicesInstituicao.excluirInstituicao(id)
    response.status(result.status_code)
    response.json(result)
}

const getSearchAllInstituicao = async (request, response) => {
    let result = await servicesInstituicao.listarTodasInstituicoes()
    response.status(result.status_code)
    response.json(result)
}

const getSearchInstituicao = async (request, response) => {
    let id = request.params.id
    let result = await servicesInstituicao.buscarInstituicao(id)
    response.status(result.status_code)
    response.json(result)
}

const postLoginInstituicao = async (request, response) => {
    let contentType = request.headers['content-type']
    let dadosBody = request.body
    console.log(dadosBody);
    
    let result = await servicesInstituicao.loginInstituicao(dadosBody, contentType)
    response.status(result.status_code)
    response.json(result)
}

const getSearchInstituicoes = async (request, response) => {
    let params = request.query
    let result = await servicesInstituicao.buscarInstituicoesPorNome(params)
    response.status(result.status_code)
    response.json(result)
}

module.exports = {
    postInstituicao,
    putInstituicao,
    deleteInstituicao,
    getSearchAllInstituicao,
    getSearchInstituicao,
    postLoginInstituicao,
    getSearchInstituicoes
}