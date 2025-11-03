const servicesPublicacao = require('../../../services/API/instituicao/publicacaoInstituicao/servicesPublicacaoInstituicao')

async function postPublicacaoInstituicao(request, response) {
    const contentType = request.headers['content-type']
    const dadosBody = request.body
    const result = await servicesPublicacao.inserirPublicacaoInstituicao(dadosBody, contentType)
    response.status(result.status_code)
    response.json(result)
}

async function putPublicacaoInstituicao(request, response) {
    const id = request.params.id
    const contentType = request.headers['content-type']
    const dadosBody = request.body
    const result = await servicesPublicacao.atualizarPublicacaoInstituicao(dadosBody, id, contentType)
    response.status(result.status_code)
    response.json(result)
}

async function deletePublicacaoInstituicao(request, response) {
    const id = request.params.id
    const result = await servicesPublicacao.excluirPublicacaoInstituicao(id)
    response.status(result.status_code)
    response.json(result)
}

async function getSearchAllPublicacaoInstituicao(request, response) {
    const result = await servicesPublicacao.listarTodasPublicacoesInstituicao()
    response.status(result.status_code)
    response.json(result)
}

async function getSearchPublicacaoInstituicao(request, response) {
    const id = request.params.id
    const result = await servicesPublicacao.buscarPublicacaoInstituicao(id)
    response.status(result.status_code)
    response.json(result)
}

async function getPublicacoesByInstituicao(request, response) {
    const id = request.params.id
    const result = await servicesPublicacao.listarPorInstituicao(id)
    response.status(result.status_code)
    response.json(result)
}

module.exports = {
    postPublicacaoInstituicao,
    putPublicacaoInstituicao,
    deletePublicacaoInstituicao,
    getSearchAllPublicacaoInstituicao,
    getSearchPublicacaoInstituicao,
    getPublicacoesByInstituicao
}
