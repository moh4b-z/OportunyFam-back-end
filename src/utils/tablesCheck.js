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
        CORRECTION.CHECK_VARCHAR_NOT_NULL(usuario.data_nascimento, 11) &&
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
    // Valida se a data é uma string de data válida
    const isValidDate = (dateStr) => {
        const date = new Date(dateStr)
        return date instanceof Date && !isNaN(date)
    }

    // Valida se a hora está no formato HH:MM
    const isValidTime = (timeStr) => {
        if (!timeStr || typeof timeStr !== 'string') return false
        const [hours, minutes] = timeStr.split(':')
        if (!hours || !minutes) return false
        const h = parseInt(hours)
        const m = parseInt(minutes)
        return h >= 0 && h < 24 && m >= 0 && m < 60
    }

    // Compara horários no formato HH:MM
    const compareTime = (time1, time2) => {
        const [h1, m1] = time1.split(':').map(n => parseInt(n))
        const [h2, m2] = time2.split(':').map(n => parseInt(n))
        if (h1 < h2) return -1
        if (h1 > h2) return 1
        if (m1 < m2) return -1
        if (m1 > m2) return 1
        return 0
    }

    return (
        CORRECTION.CHECK_ID(aula.id_atividade) &&
        // data_aula é obrigatória e deve ser uma data válida
        aula.data_aula && isValidDate(aula.data_aula) &&
        // hora_inicio e hora_fim são obrigatórias e devem estar no formato HH:MM
        isValidTime(aula.hora_inicio) && 
        isValidTime(aula.hora_fim) &&
        // hora_fim deve ser depois de hora_inicio
        compareTime(aula.hora_inicio, aula.hora_fim) < 0 &&
        // vagas_total é obrigatório e deve ser número positivo
        CORRECTION.verificarNumero(aula.vagas_total) && aula.vagas_total > 0 &&
        // vagas_disponiveis se informado deve ser número positivo
        (aula.vagas_disponiveis === undefined || 
         (CORRECTION.verificarNumero(aula.vagas_disponiveis) && 
          aula.vagas_disponiveis >= 0 && 
          aula.vagas_disponiveis <= aula.vagas_total))
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

function CHECK_tbl_inscricao_atividade(inscricao) {
    return (
        CORRECTION.CHECK_ID(inscricao.id_crianca) &&
        CORRECTION.CHECK_ID(inscricao.id_atividade) && // ID da ATIVIDADE, não mais AULA
        (inscricao.id_responsavel === undefined || inscricao.id_responsavel === null || CORRECTION.CHECK_ID(inscricao.id_responsavel)) &&
        (inscricao.id_status === undefined || CORRECTION.CHECK_ID(inscricao.id_status)) && // Status não é obrigatório no INSERT (trigger cuida)
        (inscricao.observacao === undefined || inscricao.observacao === null || CORRECTION.CHECK_VARCHAR(inscricao.observacao, 300))
    );
}

function CHECK_tbl_matricula_aula(matricula) {
    return (
        CORRECTION.CHECK_ID(matricula.id_inscricao_atividade) && // Agora relaciona com a tbl_inscricao_atividade
        CORRECTION.CHECK_ID(matricula.id_aula_atividade) &&
        (matricula.presente === undefined || typeof matricula.presente === 'boolean') &&
        (matricula.nota_observacao === undefined || CORRECTION.CHECK_VARCHAR(matricula.nota_observacao, 500))
    );
}

function CHECK_tbl_publicacao_instituicao(publicacao) {
    return (
        CORRECTION.CHECK_ID(publicacao.id_instituicao) &&
        (publicacao.descricao === undefined || CORRECTION.CHECK_TEXT(publicacao.descricao)) &&
        (publicacao.foto_perfil === undefined || CORRECTION.CHECK_VARCHAR(publicacao.foto_perfil, 400))
    )
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
    CHECK_tbl_inscricao,
    CHECK_tbl_inscricao_atividade,
    CHECK_tbl_matricula_aula
    ,
    CHECK_tbl_publicacao_instituicao
}
