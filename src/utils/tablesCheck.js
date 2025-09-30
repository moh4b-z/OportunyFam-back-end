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

function CHECK_tbl_instituicao(instituicao) {
    return (
        CORRECTION.CHECK_VARCHAR_NOT_NULL(instituicao.nome, 200) &&
        CORRECTION.CHECK_CNPJ(instituicao.cnpj) &&
        CORRECTION.CHECK_EMAIL(instituicao.email) &&
        CORRECTION.CHECK_VARCHAR_NOT_NULL(instituicao.senha, 255) && // A senha será criptografada
        (instituicao.descricao === undefined || CORRECTION.CHECK_VARCHAR(instituicao.descricao, 1000))
    );
}

function CHECK_tbl_crianca(crianca) {
    return (
        CORRECTION.CHECK_VARCHAR_NOT_NULL(crianca.nome, 150) &&
        (crianca.email === undefined || CORRECTION.CHECK_EMAIL(crianca.email)) &&
        CORRECTION.CHECK_CPF(crianca.cpf) &&
        CORRECTION.CHECK_VARCHAR_NOT_NULL(crianca.senha, 256) && // A senha será criptografada
        CORRECTION.CHECK_NOT_NULL(crianca.data_nascimento) &&
        CORRECTION.CHECK_ID(crianca.id_sexo)
    )
}


function CHECK_tbl_rede_social(redeSocial) {
    return (
        CORRECTION.CHECK_VARCHAR_NOT_NULL(redeSocial.nome, 100) &&
        CORRECTION.CHECK_VARCHAR_NOT_NULL(redeSocial.icone, 300)
    )
}


module.exports = {
    CHECK_tbl_tipo_nivel,
    CHECK_tbl_endereco,
    CHECK_tbl_usuario,
    CHECK_tbl_instituicao,
    CHECK_tbl_crianca,
    CHECK_tbl_rede_social
}