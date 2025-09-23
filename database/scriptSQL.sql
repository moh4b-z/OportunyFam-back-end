CREATE DATABASE oportunyfam;
USE oportunyfam;

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;


-- Tabelas de domínio


CREATE TABLE tbl_tipo_usuario (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(50) UNIQUE NOT NULL
);

CREATE TABLE tbl_sexo (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(50) UNIQUE NOT NULL
);

CREATE TABLE tbl_tipo_instituicao (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(100) UNIQUE NOT NULL
);

CREATE TABLE tbl_tipo_documento (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(50) UNIQUE NOT NULL
);

CREATE TABLE tbl_status_inscricao (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(50) UNIQUE NOT NULL
);

CREATE TABLE tbl_presenca (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(50) UNIQUE NOT NULL
);

CREATE TABLE tbl_status_denuncia (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(50) UNIQUE NOT NULL
);

CREATE TABLE tbl_tipo_autoridade (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(50) UNIQUE NOT NULL
);

CREATE TABLE tbl_tipo_relacao (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(50) UNIQUE NOT NULL
);

CREATE TABLE tbl_tipo_endereco (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(50) UNIQUE NOT NULL
);

CREATE TABLE tbl_tipo_rede_social (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(50) UNIQUE NOT NULL
);

CREATE TABLE tbl_rede_social (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    icone_url VARCHAR(255) NOT NULL,
    id_tipo INT NOT NULL,
    FOREIGN KEY (id_tipo) REFERENCES tbl_tipo_rede_social(id)
);



-- Núcleo de usuários


CREATE TABLE tbl_usuario (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    email VARCHAR(150) NOT NULL UNIQUE,
    senha VARCHAR(255) NOT NULL, -- hashed
    data_nascimento DATE NOT NULL,
    id_tipo INT NOT NULL,
    id_sexo INT NOT NULL,
    ativo BOOLEAN DEFAULT TRUE,
    criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    atualizado_em TIMESTAMP NULL ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (id_tipo) REFERENCES tbl_tipo_usuario(id),
    FOREIGN KEY (id_sexo) REFERENCES tbl_sexo(id)
);

CREATE TABLE tbl_documento (
    id INT AUTO_INCREMENT PRIMARY KEY,
    id_usuario INT NOT NULL,
    id_tipo INT NOT NULL,
    numero VARCHAR(60) NOT NULL,
    arquivo_url VARCHAR(300),
    verificado BOOLEAN DEFAULT FALSE,
    criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (id_usuario) REFERENCES tbl_usuario(id) ON DELETE CASCADE,
    FOREIGN KEY (id_tipo) REFERENCES tbl_tipo_documento(id)
);



-- Responsáveis e Crianças


CREATE TABLE tbl_responsavel (
    id INT AUTO_INCREMENT PRIMARY KEY,
    id_usuario INT NOT NULL UNIQUE,
    profissao VARCHAR(120),
    FOREIGN KEY (id_usuario) REFERENCES tbl_usuario(id) ON DELETE CASCADE
);

CREATE TABLE tbl_crianca (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(150) NOT NULL,
    data_nascimento DATE NOT NULL,
    id_sexo INT NOT NULL,
    necessidades_especiais TEXT,
    documento_certidao_url VARCHAR(300),
    criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (id_sexo) REFERENCES tbl_sexo(id)
);

CREATE TABLE tbl_responsavel_crianca (
    id INT AUTO_INCREMENT PRIMARY KEY,
    id_responsavel INT NOT NULL,
    id_crianca INT NOT NULL,
    id_relacao INT NOT NULL,
    id_autoridade INT NOT NULL,
    habilitado BOOLEAN DEFAULT TRUE,
    criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (id_responsavel) REFERENCES tbl_responsavel(id) ON DELETE CASCADE,
    FOREIGN KEY (id_crianca) REFERENCES tbl_crianca(id) ON DELETE CASCADE,
    FOREIGN KEY (id_relacao) REFERENCES tbl_tipo_relacao(id),
    FOREIGN KEY (id_autoridade) REFERENCES tbl_tipo_autoridade(id)
);



-- Instituições


CREATE TABLE tbl_instituicao (
    id INT AUTO_INCREMENT PRIMARY KEY,
    id_usuario INT NOT NULL UNIQUE,
    cnpj VARCHAR(20) UNIQUE,
    nome_fantasia VARCHAR(200),
    razao_social VARCHAR(200),
    id_tipo INT NOT NULL,
    descricao TEXT,
    site_instituicao VARCHAR(300),
    email_contato VARCHAR(150),
    gratuito BOOLEAN DEFAULT TRUE,
    criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    atualizado_em TIMESTAMP NULL ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (id_usuario) REFERENCES tbl_usuario(id) ON DELETE CASCADE,
    FOREIGN KEY (id_tipo) REFERENCES tbl_tipo_instituicao(id)
);



-- Atividades e inscrições


CREATE TABLE tbl_atividade (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(150) NOT NULL,
    categoria VARCHAR(100) NOT NULL,
    descricao TEXT,
    idade_minima INT,
    idade_maxima INT,
    criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE tbl_horario_atividade (
    id INT AUTO_INCREMENT PRIMARY KEY,
    id_instituicao INT NOT NULL,
    id_atividade INT NOT NULL,
    dia_semana VARCHAR(20) NOT NULL,
    hora_inicio TIME NOT NULL,
    hora_fim TIME NOT NULL,
    capacidade INT DEFAULT NULL,
    FOREIGN KEY (id_instituicao) REFERENCES tbl_instituicao(id) ON DELETE CASCADE,
    FOREIGN KEY (id_atividade) REFERENCES tbl_atividade(id) ON DELETE CASCADE
);

CREATE TABLE tbl_inscricao_atividade (
    id INT AUTO_INCREMENT PRIMARY KEY,
    id_crianca INT NOT NULL,
    id_horario INT NOT NULL,
    id_status INT NOT NULL,
    id_presenca INT DEFAULT NULL,
    data_inscricao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (id_crianca) REFERENCES tbl_crianca(id) ON DELETE CASCADE,
    FOREIGN KEY (id_horario) REFERENCES tbl_horario_atividade(id) ON DELETE CASCADE,
    FOREIGN KEY (id_status) REFERENCES tbl_status_inscricao(id),
    FOREIGN KEY (id_presenca) REFERENCES tbl_presenca(id)
);



-- Denúncias / Auditoria


CREATE TABLE tbl_denuncia (
    id INT AUTO_INCREMENT PRIMARY KEY,
    id_denunciante INT,
    id_instituicao INT DEFAULT NULL,
    id_usuario_denunciado INT DEFAULT NULL,
    id_status INT NOT NULL,
    descricao TEXT,
    criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (id_denunciante) REFERENCES tbl_usuario(id) ON DELETE SET NULL,
    FOREIGN KEY (id_instituicao) REFERENCES tbl_instituicao(id) ON DELETE SET NULL,
    FOREIGN KEY (id_usuario_denunciado) REFERENCES tbl_usuario(id) ON DELETE SET NULL,
    FOREIGN KEY (id_status) REFERENCES tbl_status_denuncia(id)
);



-- Endereços


CREATE TABLE tbl_endereco (
    id INT AUTO_INCREMENT PRIMARY KEY,
    cep VARCHAR(9) NOT NULL,
    logradouro VARCHAR(200),
    numero VARCHAR(20),
    complemento VARCHAR(100),
    bairro VARCHAR(100),
    cidade VARCHAR(100),
    estado CHAR(2),
    criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE tbl_usuario_endereco (
    id INT AUTO_INCREMENT PRIMARY KEY,
    id_usuario INT NOT NULL,
    id_endereco INT NOT NULL,
    id_tipo INT NOT NULL,
    descricao TEXT,
    FOREIGN KEY (id_usuario) REFERENCES tbl_usuario(id) ON DELETE CASCADE,
    FOREIGN KEY (id_endereco) REFERENCES tbl_endereco(id) ON DELETE CASCADE,
    FOREIGN KEY (id_tipo) REFERENCES tbl_tipo_endereco(id)
);



-- Redes sociais vinculadas


CREATE TABLE tbl_responsavel_rede_social (
    id INT AUTO_INCREMENT PRIMARY KEY,
    id_responsavel INT NOT NULL,
    id_rede_social INT NOT NULL,
    valor VARCHAR(255) NOT NULL, -- link ou número de telefone
    FOREIGN KEY (id_responsavel) REFERENCES tbl_responsavel(id) ON DELETE CASCADE,
    FOREIGN KEY (id_rede_social) REFERENCES tbl_rede_social(id)
);

CREATE TABLE tbl_instituicao_rede_social (
    id INT AUTO_INCREMENT PRIMARY KEY,
    id_instituicao INT NOT NULL,
    id_rede_social INT NOT NULL,
    valor VARCHAR(255) NOT NULL,
    FOREIGN KEY (id_instituicao) REFERENCES tbl_instituicao(id) ON DELETE CASCADE,
    FOREIGN KEY (id_rede_social) REFERENCES tbl_rede_social(id)
);


SET FOREIGN_KEY_CHECKS = 1;
