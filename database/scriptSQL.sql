CREATE DATABASE oportunyfam;
USE oportunyfam;

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;


CREATE TABLE tbl_sexo (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(50) UNIQUE NOT NULL
);

CREATE TABLE tbl_tipo_nivel (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nivel VARCHAR(100) UNIQUE NOT NULL
);

CREATE TABLE tbl_rede_social (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    icone VARCHAR(300) NOT NULL
);


CREATE TABLE tbl_usuario (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    foto_perfil VARCHAR(400),
    email VARCHAR(150) NOT NULL UNIQUE,
    senha VARCHAR(256) NOT NULL,
    data_nascimento DATE NOT NULL,
    cpf VARCHAR(11) NOT NULL,
    criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    atualizado_em TIMESTAMP NULL ON UPDATE CURRENT_TIMESTAMP,
    id_sexo INT NOT NULL,
    id_tipo_nivel INT NOT NULL,
    FOREIGN KEY (id_sexo) REFERENCES tbl_sexo(id),
    FOREIGN KEY (id_tipo_nivel) REFERENCES tbl_tipo_nivel(id)
);


CREATE TABLE tbl_crianca (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(150) NOT NULL,
    foto_perfil VARCHAR(400),
    email VARCHAR(150) UNIQUE,
    cpf VARCHAR(11) NOT NULL,
    senha VARCHAR(256) NOT NULL,
    data_nascimento DATE NOT NULL,
    criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    id_sexo INT NOT NULL,
    FOREIGN KEY (id_sexo) REFERENCES tbl_sexo(id)
);


CREATE TABLE tbl_responsavel (
    id INT AUTO_INCREMENT PRIMARY KEY,
    criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    id_usuario INT NOT NULL,
    id_crianca INT NOT NULL,
    FOREIGN KEY (id_usuario) REFERENCES tbl_usuario(id) ON DELETE CASCADE,
    FOREIGN KEY (id_crianca) REFERENCES tbl_crianca(id) ON DELETE CASCADE
);

CREATE TABLE tbl_endereco (
    id INT AUTO_INCREMENT PRIMARY KEY,
    cep VARCHAR(9) NOT NULL,
    logradouro VARCHAR(200),
    numero VARCHAR(20),
    complemento VARCHAR(100),
    bairro VARCHAR(100),
    cidade VARCHAR(100),
    estado VARCHAR(2),
    criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


CREATE TABLE tbl_usuario_endereco (
    id INT AUTO_INCREMENT PRIMARY KEY,
    descricao VARCHAR(500),
    id_usuario INT NOT NULL,
    id_endereco INT NOT NULL,
    FOREIGN KEY (id_usuario) REFERENCES tbl_usuario(id) ON DELETE CASCADE,
    FOREIGN KEY (id_endereco) REFERENCES tbl_endereco(id) ON DELETE CASCADE
);

CREATE TABLE tbl_instituicao (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(200) NOT NULL,
    logo VARCHAR(400),
    cnpj VARCHAR(14) NOT NULL,
    email VARCHAR(150) NOT NULL UNIQUE,
    senha VARCHAR(256) NOT NULL,
    descricao TEXT,
    criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    id_endereco INT NOT NULL,
    FOREIGN KEY (id_endereco) REFERENCES tbl_endereco(id)
);

CREATE TABLE tbl_instituicao_endereco (
    id INT AUTO_INCREMENT PRIMARY KEY,
    descricao VARCHAR(500),
    id_instituicao INT NOT NULL,
    id_endereco INT NOT NULL,
    FOREIGN KEY (id_instituicao) REFERENCES tbl_instituicao(id) ON DELETE CASCADE,
    FOREIGN KEY (id_endereco) REFERENCES tbl_endereco(id) ON DELETE CASCADE
);

CREATE TABLE tbl_rede_social_usuario (
    id INT AUTO_INCREMENT PRIMARY KEY,
    link_perfil VARCHAR(255),
    link_abreviado VARCHAR(20),
    numero_telefone VARCHAR(20),
    descricao TEXT,
    id_usuario INT NOT NULL,
    id_rede_social INT NOT NULL,
    FOREIGN KEY (id_usuario) REFERENCES tbl_usuario(id) ON DELETE CASCADE,
    FOREIGN KEY (id_rede_social) REFERENCES tbl_rede_social(id)
);

CREATE TABLE tbl_rede_social_instituicao (
    id INT AUTO_INCREMENT PRIMARY KEY,
    link_perfil VARCHAR(255),
    link_abreviado VARCHAR(20),
    numero_telefone VARCHAR(20),
    descricao TEXT,
    id_instituicao INT NOT NULL,
    id_rede_social INT NOT NULL,
    FOREIGN KEY (id_instituicao) REFERENCES tbl_instituicao(id) ON DELETE CASCADE,
    FOREIGN KEY (id_rede_social) REFERENCES tbl_rede_social(id)
);

SET FOREIGN_KEY_CHECKS = 1;


CREATE VIEW vw_detalhes_usuario AS
SELECT
    u.id,
    u.nome,
    u.email,
    u.data_nascimento,
    u.cpf,
    u.criado_em,
    s.nome AS sexo,
    tn.nivel AS tipo_nivel
FROM
    tbl_usuario AS u
JOIN
    tbl_sexo AS s ON u.id_sexo = s.id
JOIN
    tbl_tipo_nivel AS tn ON u.id_tipo_nivel = tn.id;



CREATE VIEW vw_instituicao_completa AS
SELECT
    i.id,
    i.nome,
    i.cnpj,
    i.email,
    i.descricao,
    i.criado_em,
    e.cep,
    e.logradouro,
    e.numero,
    e.complemento,
    e.bairro,
    e.cidade,
    e.estado
FROM
    tbl_instituicao AS i
JOIN
    tbl_instituicao_endereco AS ie ON i.id = ie.id_instituicao
JOIN
    tbl_endereco AS e ON ie.id_endereco = e.id;