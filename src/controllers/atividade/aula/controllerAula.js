const servicesAula = require("../../../services/API/atividade/aula/servicesAula")

// --- CREATE ---
async function inserirAula(req, res){
    let dadosAula = req.body
    let contentType = req.headers["content-type"]
    
    let result = await servicesAula.inserirAula(dadosAula, contentType)
    res.status(result.status_code).json(result)
}

// --- CRIAR VÁRIAS AULAS ---
async function inserirVariasAulas(req, res){
    let dadosAulas = req.body
    let contentType = req.headers["content-type"]
    
    let result = await servicesAula.inserirVariasAulas(dadosAulas, contentType)
    res.status(result.status_code).json(result)
}

// --- UPDATE ---
async function atualizarAula(req, res){
    let dadosAula = req.body
    let id = req.params.id
    let contentType = req.headers["content-type"]

    let result = await servicesAula.atualizarAula(dadosAula, id, contentType)
    res.status(result.status_code).json(result)
}

// --- DELETE ---
async function excluirAula(req, res){
    let id = req.params.id

    let result = await servicesAula.excluirAula(id)
    res.status(result.status_code).json(result)
}

// --- READ BY ID ---
async function buscarAula(req, res){
    let id = req.params.id

    let result = await servicesAula.buscarAula(id)
    res.status(result.status_code).json(result)
}

// --- READ ALL ---
async function listarTodasAulas(req, res){
    let result = await servicesAula.listarTodasAulas()
    res.status(result.status_code).json(result)
}

// --- READ BY INSTITUICAO ---
async function listarAulasPorInstituicao(req, res){
    let id = req.params.id

    let result = await servicesAula.listarAulasPorInstituicao(id)
    res.status(result.status_code).json(result)
}

module.exports = {
    inserirAula,
    inserirVariasAulas,
    atualizarAula,
    excluirAula,
    buscarAula,
    listarTodasAulas,
    listarAulasPorInstituicao
}