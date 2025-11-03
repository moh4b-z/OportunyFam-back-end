const servicesConversa = require('../../services/API/conversa/servicesConversa')

async function postConversa(request, response) {
    const contentType = request.headers['content-type']
    const dadosBody = request.body
    const result = await servicesConversa.inserirConversa(dadosBody, contentType)
    response.status(result.status_code)
    response.json(result)
}

async function putConversa(request, response) {
    const id = request.params.id
    const contentType = request.headers['content-type']
    const dadosBody = request.body
    const result = await servicesConversa.atualizarConversa(dadosBody, id, contentType)
    response.status(result.status_code)
    response.json(result)
}

async function deleteConversa(request, response) {
    const id = request.params.id
    const result = await servicesConversa.excluirConversa(id)
    response.status(result.status_code)
    response.json(result)
}

async function getSearchAllConversas(request, response) {
    const result = await servicesConversa.listarTodasConversas()
    response.status(result.status_code)
    response.json(result)
}

async function getSearchConversa(request, response) {
    const id = request.params.id
    const result = await servicesConversa.buscarConversa(id)
    response.status(result.status_code)
    response.json(result)
}
module.exports = {
    postConversa,
    putConversa,
    deleteConversa,
    getSearchAllConversas,
    getSearchConversa
}
