const servicesInstituicao = require("../../services/API/instituicao/servicesInstituicao")
const osmService = require("../../services/openStreetMap/openStreetMapService") 

const postInstituicao = async (request, response) => {
    let contentType = request.headers['content-type']
    let dadosBody = request.body
    let result = await servicesInstituicao.inserirInstituicao(dadosBody, contentType)
    // console.log(result);
    
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

const getSearchInstituicoesByName = async (request, response) => {
    let params = request.query
    let result = await servicesInstituicao.buscarInstituicoesPorNome(params)
    response.status(result.status_code)
    response.json(result)
}

async function getInstituicoesByAddress(request, response){
    const { lat, lon, tipo, raio } = request.query
    if (!lat || !lon) {
        return response.status(MENSAGE.ERROR_REQUIRED_FIELDS.status_code).json(MENSAGE.ERROR_REQUIRED_FIELDS)
    }

    const latitude = parseFloat(lat)
    const longitude = parseFloat(lon)

    if (isNaN(latitude) || isNaN(longitude)) {
        return response.status(MENSAGE.ERROR_REQUIRED_FIELDS.status_code).json({ ...MENSAGE.ERROR_REQUIRED_FIELDS, message: "Latitude e longitude devem ser valores numéricos." })
    }

    const result = await osmService.buscarInstituicoes(latitude, longitude, tipo, raio)
    response.status(result.status_code).json(result)
}

const getAlunosAprovadosByInstituicao = async (request, response) => {
    let id = request.params.id
    let result = await servicesInstituicao.buscarAlunosAprovadosPorInstituicao(id)
    
    response.status(result.status_code)
    response.json(result)
}

const getAlunosPendentesByInstituicao = async (request, response) => {
    let id = request.params.id
    let result = await servicesInstituicao.buscarAlunosPendentesPorInstituicao(id)
    
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
    getSearchInstituicoesByName,
    getInstituicoesByAddress,
    getAlunosAprovadosByInstituicao,
    getAlunosPendentesByInstituicao
}