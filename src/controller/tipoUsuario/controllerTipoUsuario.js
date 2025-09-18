const servicesTipoUsuario = require("../../services/API/tipoUsuario/servicesTipoUsuario");

async function postTipoUsuario(request, response) {
    let contentType = request.headers['content-type'];
    let dadosBody = request.body;

    let result = await servicesTipoUsuario.inserirTipoUsuario(dadosBody, contentType);

    response.status(result.status_code);
    response.json(result);
}

async function getSearchAllTipoUsuario(request, response) {
    let result = await servicesTipoUsuario.listarTodosTiposUsuario();

    response.status(result.status_code);
    response.json(result);
}

async function getSearchTipoUsuario(request, response) {
    let id = request.params.idTipoUsuario;
    let result = await servicesTipoUsuario.buscarTipoUsuario(id);

    response.status(result.status_code);
    response.json(result);
}

async function deleteTipoUsuario(request, response) {
    let id = request.params.idTipoUsuario;
    let result = await servicesTipoUsuario.excluirTipoUsuario(id);

    response.status(result.status_code);
    response.json(result);
}

async function putTipoUsuario(request, response) {
    let id = request.params.idTipoUsuario;
    let contentType = request.headers['content-type'];
    let dadosBody = request.body;

    let result = await servicesTipoUsuario.atualizarTipoUsuario(dadosBody, id, contentType);

    response.status(result.status_code);
    response.json(result);
}

module.exports = {
    postTipoUsuario,
    putTipoUsuario,
    deleteTipoUsuario,
    getSearchAllTipoUsuario,
    getSearchTipoUsuario
};

