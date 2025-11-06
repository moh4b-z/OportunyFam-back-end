const servicesAtividade = require("../../services/API/atividade/servicesAtividade")
const servicesAula = require("../../services/API/atividade/aula/servicesAula")

const postAtividade = async (request, response) => {
    let contentType = request.headers['content-type']
    let dadosBody = request.body
    let result = await servicesAtividade.inserirAtividade(dadosBody, contentType)
    response.status(result.status_code)
    response.json(result)
}

const getSearchAllAtividades = async (request, response) => {
    let result = await servicesAtividade.listarTodasAtividades()
    response.status(result.status_code)
    response.json(result)
}

const getSearchAtividade = async (request, response) => {
    let id = request.params.id
    let result = await servicesAtividade.buscarAtividade(id)
    response.status(result.status_code)
    response.json(result)
}

const deleteAtividade = async (request, response) => {
    let id = request.params.id
    let result = await servicesAtividade.excluirAtividade(id)
    response.status(result.status_code)
    response.json(result)
}

const putAtividade = async (request, response) => {
    let id = request.params.id
    let contentType = request.headers['content-type']
    let dadosBody = request.body
    let result = await servicesAtividade.atualizarAtividade(dadosBody, id, contentType)
    response.status(result.status_code)
    response.json(result)
}

const postAula = async (request, response) => {
    let contentType = request.headers['content-type']
    let dadosBody = request.body
    let result = await servicesAula.inserirAula(dadosBody, contentType)
    response.status(result.status_code)
    response.json(result)
}

const postAulasLote = async (request, response) => {
    let contentType = request.headers['content-type']
    let dadosBody = request.body
    let result = await servicesAula.inserirVariasAulas(dadosBody, contentType)
    response.status(result.status_code)
    response.json(result)
}

const deleteAula = async (request, response) => {
    let id = request.params.id
    let result = await servicesAula.excluirAula(id)
    response.status(result.status_code)
    response.json(result)
}

const putAula = async (request, response) => {
    let id = request.params.id
    let contentType = request.headers['content-type']
    let dadosBody = request.body
    let result = await servicesAula.atualizarAula(dadosBody, id, contentType)
    response.status(result.status_code)
    response.json(result)
}

const getSearchAula = async (request, response) => {
    let id = request.params.id
    let result = await servicesAula.buscarAula(id)
    response.status(result.status_code)
    response.json(result)
}

const getSearchAllAulas = async (request, response) => {
    let result = await servicesAula.listarTodasAulas()
    response.status(result.status_code)
    response.json(result)
}

const getSearchAulasByInstituicao = async (request, response) => {
    let idInstituicao = request.params.idInstituicao
    let result = await servicesAula.listarAulasPorInstituicao(idInstituicao)
    response.status(result.status_code)
    response.json(result)
}
const getSearchAtividadesByInstituicao = async (request, response) => {
    let idInstituicao = request.params.idInstituicao
    let result = await servicesAtividade.buscarAtividadePorInstituicao(idInstituicao)
    response.status(result.status_code)
    response.json(result)
}


module.exports = {
    postAtividade,
    putAtividade,
    deleteAtividade,
    getSearchAllAtividades,
    getSearchAtividade,
    postAula,
    postAulasLote,
    putAula,
    deleteAula,
    getSearchAula,
    getSearchAllAulas,
    getSearchAulasByInstituicao,
    getSearchAtividadesByInstituicao
}