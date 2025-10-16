const servicesMatriculaAula = require("../../../services/API/atividade/matriculaAula/servicesMatriculaAula")

// --- POST: Inserir Nova Matrícula (Marcar Presença Inicial) ---
const postMatriculaAula = async (request, response) => {
    let contentType = request.headers['content-type']
    let dadosBody = request.body
    
    let result = await servicesMatriculaAula.inserirMatriculaAula(dadosBody, contentType)
    
    response.status(result.status_code)
    response.json(result)
}

// --- GET: Listar Matrículas (Presenças) por ID da Inscrição ---
const getMatriculasByInscricao = async (request, response) => {
    // Aqui usamos o ID da Inscrição na Atividade (tbl_inscricao_atividade)
    let idInscricao = request.params.idInscricao
    let result = await servicesMatriculaAula.listarMatriculasPorInscricao(idInscricao)
    
    response.status(result.status_code)
    response.json(result)
}

// --- PUT: Atualizar Matrícula (Mudar Presença/Observação) ---
const putMatriculaAula = async (request, response) => {
    let id = request.params.id // ID da tbl_matricula_aula
    let contentType = request.headers['content-type']
    let dadosBody = request.body
    
    let result = await servicesMatriculaAula.atualizarMatriculaAula(dadosBody, id, contentType)
    
    response.status(result.status_code)
    response.json(result)
}

// --- DELETE: Excluir Matrícula (Remover registro de presença) ---
const deleteMatriculaAula = async (request, response) => {
    let id = request.params.id
    let result = await servicesMatriculaAula.excluirMatriculaAula(id)
    
    response.status(result.status_code)
    response.json(result)
}

module.exports = {
    postMatriculaAula,
    getMatriculasByInscricao,
    putMatriculaAula,
    deleteMatriculaAula
}