// src/controllers/redeSocialInstituicao/controllerRedeSocialInstituicao.js

const servicesRedeSocialInstituicao = require("../../services/API/redeSocialInstituicao/servicesRedeSocialInstituicao")

const postRedeSocialInstituicao = async (request, response) => {
    let contentType = request.headers['content-type']
    let dadosBody = request.body
    let result = await servicesRedeSocialInstituicao.inserirRedeSocialInstituicao(dadosBody, contentType)
    response.status(result.status_code)
    response.json(result)
}

const putRedeSocialInstituicao = async (request, response) => {
    let id = request.params.id
    let contentType = request.headers['content-type']
    let dadosBody = request.body
    let result = await servicesRedeSocialInstituicao.atualizarRedeSocialInstituicao(dadosBody, id, contentType)
    response.status(result.status_code)
    response.json(result)
}

const deleteRedeSocialInstituicao = async (request, response) => {
    let id = request.params.id
    let result = await servicesRedeSocialInstituicao.excluirRedeSocialInstituicao(id)
    response.status(result.status_code)
    response.json(result)
}

const getSearchAllRedeSocialInstituicao = async (request, response) => {
    let result = await servicesRedeSocialInstituicao.listarTodasRedesSociaisInstituicao()
    response.status(result.status_code)
    response.json(result)
}

const getSearchRedeSocialInstituicao = async (request, response) => {
    let id = request.params.id
    let result = await servicesRedeSocialInstituicao.buscarRedeSocialInstituicao(id)
    response.status(result.status_code)
    response.json(result)
}

module.exports = {
    postRedeSocialInstituicao,
    putRedeSocialInstituicao,
    deleteRedeSocialInstituicao,
    getSearchAllRedeSocialInstituicao,
    getSearchRedeSocialInstituicao
}