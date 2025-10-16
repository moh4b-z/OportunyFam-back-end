const servicesInscricaoAtividade = require("../../../services/API/atividade/inscricaoAtividade/servicesInscricaoAtividade")

const postInscricao = async (request, response) => {
    let contentType = request.headers['content-type']
    let dadosBody = request.body
    
    let result = await servicesInscricaoAtividade.inserirInscricaoAtividade(dadosBody, contentType)
    
    response.status(result.status_code)
    response.json(result)
}

// --- GET: Listar Todas Inscrições ---
const getSearchAllInscricoes = async (request, response) => {
    let result = await servicesInscricaoAtividade.listarTodasInscricoes()
    
    response.status(result.status_code)
    response.json(result)
}

// --- GET: Buscar Inscrição por ID ---
const getSearchInscricao = async (request, response) => {
    let id = request.params.id
    let result = await servicesInscricaoAtividade.buscarInscricaoPorId(id)
    
    response.status(result.status_code)
    response.json(result)
}

// --- PUT: Atualizar Inscrição (Status, Responsável, Observação) ---
const putInscricao = async (request, response) => {
    let id = request.params.id
    let contentType = request.headers['content-type']
    let dadosBody = request.body
    
    let result = await servicesInscricaoAtividade.atualizarInscricaoAtividade(dadosBody, id, contentType)
    
    response.status(result.status_code)
    response.json(result)
}

// --- DELETE: Excluir Inscrição ---
const deleteInscricao = async (request, response) => {
    let id = request.params.id
    let result = await servicesInscricaoAtividade.excluirInscricao(id)
    
    response.status(result.status_code)
    response.json(result)
}

module.exports = {
    postInscricao,
    getSearchAllInscricoes,
    getSearchInscricao,
    putInscricao,
    deleteInscricao
}