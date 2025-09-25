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
    )
}

function CHECK_tbl_usuario(usuario) {
    return (
        CORRECTION.CHECK_VARCHAR_NOT_NULL(usuario.nome, 100) &&
        CORRECTION.CHECK_EMAIL(usuario.email) &&
        CORRECTION.CHECK_VARCHAR_NOT_NULL(usuario.senha, 256) &&
        CORRECTION.CHECK_NOT_NULL(usuario.data_nascimento) &&
        CORRECTION.CHECK_CPF(usuario.cpf) &&
        CORRECTION.CHECK_ID(usuario.id_sexo) &&
        CORRECTION.CHECK_ID(usuario.id_tipo_nivel)
    );
}


module.exports = {
    CHECK_tbl_tipo_nivel,
    CHECK_tbl_endereco,
    CHECK_tbl_usuario,
};