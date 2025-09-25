const CORRECTION = require("./inputCheck");

function CHECK_tbl_tipo_nivel(tipoNivel) {
    return (
        CORRECTION.CHECK_VARCHAR_NOT_NULL(tipoNivel.nivel, 100)
    );
}

function CHECK_tbl_endereco(endereco) {
    return (
        CORRECTION.CHECK_VARCHAR_NOT_NULL(endereco.cep, 9) &&
        (endereco.logradouro === undefined || CORRECTION.CHECK_VARCHAR(endereco.logradouro, 200)) &&
        (endereco.numero === undefined || CORRECTION.CHECK_VARCHAR(endereco.numero, 20)) &&
        (endereco.complemento === undefined || CORRECTION.CHECK_VARCHAR(endereco.complemento, 100)) &&
        (endereco.bairro === undefined || CORRECTION.CHECK_VARCHAR(endereco.bairro, 100)) &&
        (endereco.cidade === undefined || CORRECTION.CHECK_VARCHAR(endereco.cidade, 100)) &&
        (endereco.estado === undefined || CORRECTION.CHECK_VARCHAR(endereco.estado, 2))
    );
}


module.exports = {
    CHECK_tbl_tipo_nivel,
    CHECK_tbl_endereco,
};