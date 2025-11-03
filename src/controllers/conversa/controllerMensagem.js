const servicesMensagem = require('../../services/API/conversa/servicesMensagem')

async function postMensagem(request, response) {
    const contentType = request.headers['content-type']
    const dadosBody = request.body
    const result = await servicesMensagem.inserirMensagem(dadosBody, contentType)
    response.status(result.status_code)
    response.json(result)
}

async function putMensagem(request, response) {
    const id = request.params.id
    const contentType = request.headers['content-type']
    const dadosBody = request.body
    const result = await servicesMensagem.atualizarMensagem(dadosBody, id, contentType)
    response.status(result.status_code)
    response.json(result)
}

async function deleteMensagem(request, response) {
    const id = request.params.id
    const result = await servicesMensagem.excluirMensagem(id)
    response.status(result.status_code)
    response.json(result)
}

async function getMensagensByConversa(request, response) {
    const id = request.params.id
    const result = await servicesMensagem.listarMensagensPorConversa(id)
    response.status(result.status_code)
    response.json(result)
}

async function getSearchMensagem(request, response) {
    const id = request.params.id
    const result = await servicesMensagem.buscarMensagem(id)
    response.status(result.status_code)
    response.json(result)
}

module.exports = {
    postMensagem,
    putMensagem,
    deleteMensagem,
    getMensagensByConversa,
    getSearchMensagem
}
