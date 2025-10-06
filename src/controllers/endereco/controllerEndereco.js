const servicesEndereco = require("../../services/API/endereco/servicesEndereco")
const osmService = require("../../services/openStreetMap/openStreetMapService") 

const postEndereco = async (request, response) => {
    let contentType = request.headers['content-type']
    let dadosBody = request.body
    let result = await servicesEndereco.inserirEndereco(dadosBody, contentType)
    response.status(result.status_code)
    response.json(result)
}

const getSearchAllEndereco = async (request, response) => {
    let result = await servicesEndereco.listarTodosEnderecos()
    response.status(result.status_code)
    response.json(result)
}

const getSearchEndereco = async (request, response) => {
    let id = request.params.id
    let result = await servicesEndereco.buscarEndereco(id)
    response.status(result.status_code)
    response.json(result)
}

const deleteEndereco = async (request, response) => {
    let id = request.params.id
    let result = await servicesEndereco.excluirEndereco(id)
    response.status(result.status_code)
    response.json(result)
}

const putEndereco = async (request, response) => {
    let id = request.params.id
    let contentType = request.headers['content-type']
    let dadosBody = request.body
    let result = await servicesEndereco.atualizarEndereco(dadosBody, id, contentType)
    response.status(result.status_code)
    response.json(result)
}

async function getInstituicoes(request, response){
    const { lat, lon, tipo, raio } = request.query
    if (!lat || !lon) {
        return response.status(MENSAGE.ERROR_REQUIRED_FIELDS.status_code).json(MENSAGE.ERROR_REQUIRED_FIELDS)
    }

    // Garante que lat e lon são números
    const latitude = parseFloat(lat)
    const longitude = parseFloat(lon)

    if (isNaN(latitude) || isNaN(longitude)) {
        return response.status(MENSAGE.ERROR_REQUIRED_FIELDS.status_code).json({ ...MENSAGE.ERROR_REQUIRED_FIELDS, message: "Latitude e longitude devem ser valores numéricos." })
    }

    const result = await osmService.buscarInstituicoes(latitude, longitude, tipo, raio)
    response.status(result.status_code).json(result)
}


module.exports = {
    postEndereco,
    putEndereco,
    deleteEndereco,
    getSearchAllEndereco,
    getSearchEndereco,
    getInstituicoes
}