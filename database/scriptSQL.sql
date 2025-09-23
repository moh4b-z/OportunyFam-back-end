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
    nome VARCHAR(100) UNIQUE NOT NULL
);

CREATE TABLE tbl_rede_social (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(100) NOT NULL
);


CREATE TABLE tbl_usuario (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    email VARCHAR(150) NOT NULL UNIQUE,
    senha VARCHAR(255) NOT NULL, -- senha criptografada
    data_nascimento DATE NOT NULL,
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
    estado CHAR(2),
    criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


CREATE TABLE tbl_usuario_endereco (
    id INT AUTO_INCREMENT PRIMARY KEY,
    id_usuario INT NOT NULL,
    id_endereco INT NOT NULL,
    FOREIGN KEY (id_usuario) REFERENCES tbl_usuario(id) ON DELETE CASCADE,
    FOREIGN KEY (id_endereco) REFERENCES tbl_endereco(id) ON DELETE CASCADE
);

-- Relação Instituição ↔ Endereço (1:1)
-- cada instituição fica em um endereço
CREATE TABLE tbl_instituicao (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(200) NOT NULL,
    descricao TEXT,
    id_endereco INT NOT NULL,
    criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (id_endereco) REFERENCES tbl_endereco(id)
);

-- ==========================
-- REDES SOCIAIS
-- ==========================

-- Relação Usuário ↔ Rede Social
CREATE TABLE tbl_rede_social_usuario (
    id INT AUTO_INCREMENT PRIMARY KEY,
    id_usuario INT NOT NULL,
    id_rede_social INT NOT NULL,
    link_perfil VARCHAR(255),
    FOREIGN KEY (id_usuario) REFERENCES tbl_usuario(id) ON DELETE CASCADE,
    FOREIGN KEY (id_rede_social) REFERENCES tbl_rede_social(id)
);

-- Relação Instituição ↔ Rede Social
CREATE TABLE tbl_rede_social_instituicao (
    id INT AUTO_INCREMENT PRIMARY KEY,
    id_instituicao INT NOT NULL,
    id_rede_social INT NOT NULL,
    link_perfil VARCHAR(255),
    FOREIGN KEY (id_instituicao) REFERENCES tbl_instituicao(id) ON DELETE CASCADE,
    FOREIGN KEY (id_rede_social) REFERENCES tbl_rede_social(id)
);

SET FOREIGN_KEY_CHECKS = 1;
