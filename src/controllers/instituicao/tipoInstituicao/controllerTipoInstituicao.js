const servicesTipoInstituicao = require("../../../services/API/instituicao/tipoInstituicao/servicesTipoInstituicao");

async function postTipoInstituicao(request, response) {
    let contentType = request.headers['content-type'];
    let dadosBody = request.body;

    let result = await servicesTipoInstituicao.inserirTipoInstituicao(dadosBody, contentType);

    response.status(result.status_code);
    response.json(result);
}

async function putTipoInstituicao(request, response) {
    let id = request.params.id;
    let contentType = request.headers['content-type'];
    let dadosBody = request.body;

    let result = await servicesTipoInstituicao.atualizarTipoInstituicao(dadosBody, id, contentType);

    response.status(result.status_code);
    response.json(result);
}

async function deleteTipoInstituicao(request, response) {
    let id = request.params.id;
    let result = await servicesTipoInstituicao.excluirTipoInstituicao(id);

    response.status(result.status_code);
    response.json(result);
}

async function getSearchAllTipoInstituicao(request, response) {
    let result = await servicesTipoInstituicao.listarTodosTipoInstituicao();

    response.status(result.status_code);
    response.json(result);
}

async function getSearchTipoInstituicao(request, response) {
    let id = request.params.id;
    let result = await servicesTipoInstituicao.buscarTipoInstituicao(id);

    response.status(result.status_code);
    response.json(result);
}

module.exports = {
    postTipoInstituicao,
    putTipoInstituicao,
    deleteTipoInstituicao,
    getSearchAllTipoInstituicao,
    getSearchTipoInstituicao
};