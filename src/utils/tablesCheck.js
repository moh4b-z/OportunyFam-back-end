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
        CORRECTION.CHECK_VARCHAR_NOT_NULL(instituicao.senha, 256) && // A senha será criptografada
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

function CHECK_tbl_rede_social_usuario(redeSocialUsuario) {
    return (
        CORRECTION.CHECK_ID(redeSocialUsuario.id_usuario) &&
        CORRECTION.CHECK_ID(redeSocialUsuario.id_rede_social) &&
        (redeSocialUsuario.link_perfil === undefined || CORRECTION.CHECK_VARCHAR(redeSocialUsuario.link_perfil, 256)) &&
        (redeSocialUsuario.link_abreviado === undefined || CORRECTION.CHECK_VARCHAR(redeSocialUsuario.link_abreviado, 20)) &&
        (redeSocialUsuario.numero_telefone === undefined || CORRECTION.CHECK_VARCHAR(redeSocialUsuario.numero_telefone, 20)) &&
        (redeSocialUsuario.descricao === undefined || CORRECTION.CHECK_TEXT(redeSocialUsuario.descricao))
    )
}

function CHECK_tbl_rede_social_instituicao(redeSocialInstituicao) {
    return (
        CORRECTION.CHECK_ID(redeSocialInstituicao.id_instituicao) &&
        CORRECTION.CHECK_ID(redeSocialInstituicao.id_rede_social) &&
        (redeSocialInstituicao.link_perfil === undefined || CORRECTION.CHECK_VARCHAR(redeSocialInstituicao.link_perfil, 256)) &&
        (redeSocialInstituicao.link_abreviado === undefined || CORRECTION.CHECK_VARCHAR(redeSocialInstituicao.link_abreviado, 20)) &&
        (redeSocialInstituicao.numero_telefone === undefined || CORRECTION.CHECK_VARCHAR(redeSocialInstituicao.numero_telefone, 20)) &&
        (redeSocialInstituicao.descricao === undefined || CORRECTION.CHECK_TEXT(redeSocialInstituicao.descricao))
    )
}

function CHECK_tbl_tipo_instituicao(tipo) {
    return (
        CORRECTION.CHECK_VARCHAR_NOT_NULL(tipo.nome, 80)
    );
}

function CHECK_tbl_categoria(categoria) {
    return (
        CORRECTION.CHECK_VARCHAR_NOT_NULL(categoria.nome, 100)
    );
}

function CHECK_tbl_atividades(atividade) {
    return (
        CORRECTION.CHECK_ID(atividade.id_instituicao) &&
        CORRECTION.CHECK_ID(atividade.id_categoria) &&
        CORRECTION.CHECK_VARCHAR_NOT_NULL(atividade.titulo, 140) &&
        (atividade.descricao === undefined || CORRECTION.CHECK_TEXT(atividade.descricao)) &&
        CORRECTION.verificarNumero(atividade.faixa_etaria_min) &&
        CORRECTION.verificarNumero(atividade.faixa_etaria_max) &&
        atividade.faixa_etaria_min <= atividade.faixa_etaria_max &&
        CORRECTION.CHECK_TINYINT(atividade.gratuita ? 1 : 0) &&
        (atividade.preco === undefined || CORRECTION.CHECK_DECIMAL(atividade.preco, 10, 2)) &&
        CORRECTION.CHECK_TINYINT(atividade.ativo ? 1 : 0)
    );
}

function CHECK_tbl_aulas_atividade(aula) {
    return (
        CORRECTION.CHECK_ID(aula.id_atividade) &&
        CORRECTION.verificarNumero(aula.dia_semana) &&
        aula.dia_semana >= 1 && aula.dia_semana <= 7 &&
        CORRECTION.CHECK_NOT_NULL(aula.hora_inicio) &&
        CORRECTION.CHECK_NOT_NULL(aula.hora_fim) &&
        aula.hora_inicio < aula.hora_fim &&
        CORRECTION.verificarNumero(aula.vagas_total) &&
        CORRECTION.verificarNumero(aula.vagas_disponiveis) &&
        CORRECTION.CHECK_TINYINT(aula.ativo ? 1 : 0)
    );
}

function CHECK_tbl_status_inscricao(status) {
    return (
        CORRECTION.CHECK_ID(status.id) &&
        CORRECTION.CHECK_VARCHAR_NOT_NULL(status.nome, 40)
    );
}

function CHECK_tbl_inscricao(inscricao) {
    return (
        CORRECTION.CHECK_ID(inscricao.id_responsavel) &&
        CORRECTION.CHECK_ID(inscricao.id_crianca) &&
        CORRECTION.CHECK_ID(inscricao.id_aula_atividade) &&
        (inscricao.id_status === undefined || CORRECTION.CHECK_ID(inscricao.id_status)) &&
        (inscricao.observacao === undefined || CORRECTION.CHECK_VARCHAR(inscricao.observacao, 300))
    );
}




module.exports = {
    CHECK_tbl_tipo_nivel,
    CHECK_tbl_endereco,
    CHECK_tbl_usuario,
    CHECK_tbl_instituicao,
    CHECK_tbl_crianca,
    CHECK_tbl_rede_social,
    CHECK_tbl_rede_social_usuario,
    CHECK_tbl_rede_social_instituicao,
    CHECK_tbl_tipo_instituicao,
    CHECK_tbl_categoria,
    CHECK_tbl_atividades,
    CHECK_tbl_aulas_atividade,
    CHECK_tbl_status_inscricao,
    CHECK_tbl_inscricao
}
