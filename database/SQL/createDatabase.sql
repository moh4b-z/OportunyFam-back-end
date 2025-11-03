CREATE DATABASE IF NOT EXISTS oportunyfam;
USE oportunyfam;

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

CREATE TABLE tbl_sexo (
  id   INT AUTO_INCREMENT PRIMARY KEY,
  nome VARCHAR(50) UNIQUE NOT NULL
) ENGINE=InnoDB;

CREATE TABLE tbl_tipo_nivel (
  id    INT AUTO_INCREMENT PRIMARY KEY,
  nivel VARCHAR(100) UNIQUE NOT NULL
) ENGINE=InnoDB;

CREATE TABLE tbl_rede_social (
  id    INT AUTO_INCREMENT PRIMARY KEY,
  nome  VARCHAR(100) UNIQUE NOT NULL,
  icone VARCHAR(300) NOT NULL
) ENGINE=InnoDB;

CREATE TABLE tbl_pessoa (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nome VARCHAR(150) NOT NULL,
  email VARCHAR(150) UNIQUE,
  senha VARCHAR(256) NOT NULL,
  telefone VARCHAR(16),
  foto_perfil VARCHAR(400),
  cpf VARCHAR(11) UNIQUE,
  data_nascimento DATE,
  criado_em TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  atualizado_em TIMESTAMP NULL ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB;

CREATE TABLE tbl_usuario (
  id INT AUTO_INCREMENT PRIMARY KEY,
  id_sexo INT NOT NULL,
  CONSTRAINT fk_usuario_sexo FOREIGN KEY (id_sexo) REFERENCES tbl_sexo(id),
  id_tipo_nivel INT NOT NULL,
  CONSTRAINT fk_usuario_tipo_nivel FOREIGN KEY (id_tipo_nivel) REFERENCES tbl_tipo_nivel(id),
  id_pessoa INT NOT NULL UNIQUE,
  CONSTRAINT fk_usuario_pessoa FOREIGN KEY (id_pessoa) REFERENCES tbl_pessoa(id) ON DELETE CASCADE
) ENGINE=InnoDB;

CREATE TABLE tbl_crianca (
  id INT AUTO_INCREMENT PRIMARY KEY,
  id_sexo INT NOT NULL,
  CONSTRAINT fk_crianca_sexo FOREIGN KEY (id_sexo) REFERENCES tbl_sexo(id),
  id_pessoa INT NOT NULL UNIQUE,
  CONSTRAINT fk_crianca_pessoa FOREIGN KEY (id_pessoa) REFERENCES tbl_pessoa(id) ON DELETE CASCADE
) ENGINE=InnoDB;

CREATE TABLE tbl_responsavel (
  id INT AUTO_INCREMENT PRIMARY KEY,
  criado_em TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  id_usuario INT NOT NULL,
  id_crianca INT NOT NULL,
  UNIQUE KEY uk_resp (id_usuario, id_crianca),
  CONSTRAINT fk_resp_usuario FOREIGN KEY (id_usuario) REFERENCES tbl_usuario(id) ON DELETE CASCADE,
  CONSTRAINT fk_resp_crianca FOREIGN KEY (id_crianca) REFERENCES tbl_crianca(id) ON DELETE CASCADE
) ENGINE=InnoDB;

CREATE TABLE tbl_endereco (
  id INT AUTO_INCREMENT PRIMARY KEY,
  osm_id BIGINT,
  nome VARCHAR(200),
  tipo VARCHAR(100),
  cep VARCHAR(9),
  logradouro VARCHAR(200),
  numero VARCHAR(20),
  complemento VARCHAR(100),
  bairro VARCHAR(100),
  cidade VARCHAR(100),
  estado VARCHAR(2),
  telefone VARCHAR(50),
  site VARCHAR(255),
  latitude DECIMAL(10,7) NOT NULL,
  longitude DECIMAL(10,7) NOT NULL,
  geo POINT AS (ST_SRID(POINT(longitude, latitude), 4326)) STORED NOT NULL,
  atualizado_em TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  criado_em TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY uk_end_osm (osm_id),
  SPATIAL INDEX spx_end_geo (geo),
  FULLTEXT KEY ft_end (nome, logradouro, bairro, cidade)
) ENGINE=InnoDB;

CREATE TABLE tbl_usuario_endereco (
  id INT AUTO_INCREMENT PRIMARY KEY,
  descricao VARCHAR(500),
  id_usuario INT NOT NULL,
  id_endereco INT NOT NULL,
  CONSTRAINT fk_uend_usuario FOREIGN KEY (id_usuario) REFERENCES tbl_usuario(id) ON DELETE CASCADE,
  CONSTRAINT fk_uend_endereco FOREIGN KEY (id_endereco) REFERENCES tbl_endereco(id) ON DELETE CASCADE
) ENGINE=InnoDB;

CREATE TABLE tbl_instituicao (
  id INT AUTO_INCREMENT PRIMARY KEY,
  cnpj VARCHAR(14) NOT NULL UNIQUE,
  descricao TEXT,
  id_endereco INT NOT NULL,
  CONSTRAINT fk_inst_endereco FOREIGN KEY (id_endereco) REFERENCES tbl_endereco(id) ON DELETE CASCADE,
  id_pessoa INT NOT NULL UNIQUE,
  CONSTRAINT fk_inst_pessoa FOREIGN KEY (id_pessoa) REFERENCES tbl_pessoa(id) ON DELETE CASCADE
) ENGINE=InnoDB;

CREATE TABLE tbl_rede_social_instituicao (
  id INT AUTO_INCREMENT PRIMARY KEY,
  link_perfil VARCHAR(255),
  link_abreviado VARCHAR(20),
  numero_telefone VARCHAR(20),
  descricao TEXT,
  id_instituicao INT NOT NULL,
  id_rede_social INT NOT NULL,
  CONSTRAINT fk_rsi_inst FOREIGN KEY (id_instituicao) REFERENCES tbl_instituicao(id) ON DELETE CASCADE,
  CONSTRAINT fk_rsi_rede_social FOREIGN KEY (id_rede_social) REFERENCES tbl_rede_social(id)
) ENGINE=InnoDB;

CREATE TABLE tbl_tipo_instituicao (
  id TINYINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  nome VARCHAR(80) NOT NULL UNIQUE
) ENGINE=InnoDB;

CREATE TABLE tbl_instituicao_tipo_instituicao (
  id INT AUTO_INCREMENT PRIMARY KEY,
  id_instituicao INT NOT NULL,
  id_tipo_instituicao TINYINT UNSIGNED NOT NULL,
  UNIQUE KEY uk_inst_tipo (id_instituicao, id_tipo_instituicao),
  CONSTRAINT fk_it_inst FOREIGN KEY (id_instituicao) REFERENCES tbl_instituicao(id) ON DELETE CASCADE,
  CONSTRAINT fk_it_tipo FOREIGN KEY (id_tipo_instituicao) REFERENCES tbl_tipo_instituicao(id) ON DELETE RESTRICT
) ENGINE=InnoDB;

CREATE TABLE tbl_categoria (
  id SMALLINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  nome VARCHAR(100) NOT NULL UNIQUE
) ENGINE=InnoDB;

CREATE TABLE tbl_atividade (
  id INT AUTO_INCREMENT PRIMARY KEY,
  id_instituicao INT NOT NULL,
  id_categoria SMALLINT UNSIGNED NOT NULL,
  titulo VARCHAR(140) NOT NULL,
  descricao TEXT,
  faixa_etaria_min INT UNSIGNED NOT NULL,
  faixa_etaria_max INT UNSIGNED NOT NULL,
  gratuita BOOLEAN NOT NULL DEFAULT TRUE,
  preco DECIMAL(10,2) NOT NULL DEFAULT 0,
  ativo BOOLEAN NOT NULL DEFAULT TRUE,
  CONSTRAINT ck_ativ_faixa CHECK (faixa_etaria_min <= faixa_etaria_max),
  CONSTRAINT fk_ativ_inst FOREIGN KEY (id_instituicao) REFERENCES tbl_instituicao(id) ON DELETE CASCADE,
  CONSTRAINT fk_ativ_cat FOREIGN KEY (id_categoria) REFERENCES tbl_categoria(id) ON DELETE RESTRICT,
  FULLTEXT KEY ft_ativ (titulo, descricao)
) ENGINE=InnoDB;

CREATE TABLE tbl_aulas_atividade (
  id INT AUTO_INCREMENT PRIMARY KEY,
  id_atividade INT NOT NULL,
  data_aula DATE NOT NULL,
  hora_inicio TIME NOT NULL,
  hora_fim TIME NOT NULL,
  vagas_total SMALLINT UNSIGNED NOT NULL,
  vagas_disponiveis SMALLINT UNSIGNED NOT NULL,
  CONSTRAINT ck_aula_horas CHECK (hora_inicio < hora_fim),
  CONSTRAINT fk_aula_ativ FOREIGN KEY (id_atividade) REFERENCES tbl_atividade(id) ON DELETE CASCADE
) ENGINE=InnoDB;

CREATE TABLE tbl_status_inscricao (
  id TINYINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  nome VARCHAR(50) UNIQUE NOT NULL
) ENGINE=InnoDB;

CREATE TABLE tbl_inscricao_atividade (
  id INT AUTO_INCREMENT PRIMARY KEY,
  id_crianca INT NOT NULL,
  id_atividade INT NOT NULL,
  id_responsavel INT NULL DEFAULT NULL,
  id_status TINYINT UNSIGNED NOT NULL,
  observacao VARCHAR(300),
  criado_em TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  atualizado_em TIMESTAMP NULL ON UPDATE CURRENT_TIMESTAMP,
  UNIQUE KEY uk_crianca_atividade (id_crianca, id_atividade),
  CONSTRAINT fk_inscativ_crianca FOREIGN KEY (id_crianca) REFERENCES tbl_crianca(id) ON DELETE CASCADE,
  CONSTRAINT fk_inscativ_ativ FOREIGN KEY (id_atividade) REFERENCES tbl_atividade(id) ON DELETE CASCADE,
  CONSTRAINT fk_inscativ_resp FOREIGN KEY (id_responsavel) REFERENCES tbl_responsavel(id) ON DELETE SET NULL,
  CONSTRAINT fk_inscativ_status FOREIGN KEY (id_status) REFERENCES tbl_status_inscricao(id) ON DELETE RESTRICT
) ENGINE=InnoDB;

CREATE TABLE tbl_matricula_aula (
  id INT AUTO_INCREMENT PRIMARY KEY,
  id_inscricao_atividade INT NOT NULL,
  id_aula_atividade INT NOT NULL,
  presente BOOLEAN NOT NULL DEFAULT FALSE,
  nota_observacao VARCHAR(500),
  criado_em TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  atualizado_em TIMESTAMP NULL ON UPDATE CURRENT_TIMESTAMP,
  UNIQUE KEY uk_matricula_aula (id_inscricao_atividade, id_aula_atividade),
  CONSTRAINT fk_matr_inscricao FOREIGN KEY (id_inscricao_atividade) REFERENCES tbl_inscricao_atividade(id) ON DELETE CASCADE,
  CONSTRAINT fk_matr_aula FOREIGN KEY (id_aula_atividade) REFERENCES tbl_aulas_atividade(id) ON DELETE CASCADE
) ENGINE=InnoDB;

CREATE TABLE tbl_conversa (
  id INT AUTO_INCREMENT PRIMARY KEY,
  criado_em TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  atualizado_em TIMESTAMP NULL ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB;

CREATE TABLE tbl_pessoa_conversa (
  id INT AUTO_INCREMENT PRIMARY KEY,
  id_pessoa INT NOT NULL,
  id_conversa INT NOT NULL,
  CONSTRAINT fk_pessoa_conversa FOREIGN KEY (id_pessoa) REFERENCES tbl_pessoa(id) ON DELETE CASCADE,
  CONSTRAINT fk_conversa_pessoa FOREIGN KEY (id_conversa) REFERENCES tbl_conversa(id) ON DELETE CASCADE,
  UNIQUE KEY uk_pessoa_conversa (id_pessoa, id_conversa)
) ENGINE=InnoDB;

CREATE TABLE tbl_mensagem (
  id INT AUTO_INCREMENT PRIMARY KEY,
  descricao TEXT NOT NULL,
  visto BOOLEAN DEFAULT FALSE,
  criado_em TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  atualizado_em TIMESTAMP NULL ON UPDATE CURRENT_TIMESTAMP,
  id_conversa INT NOT NULL,
  id_pessoa INT NOT NULL,
  CONSTRAINT fk_conversa_mensagem FOREIGN KEY (id_conversa) REFERENCES tbl_conversa(id) ON DELETE CASCADE,
  CONSTRAINT fk_pessoa_mensagem FOREIGN KEY (id_pessoa) REFERENCES tbl_pessoa(id) ON DELETE CASCADE
) ENGINE=InnoDB;

CREATE TABLE tbl_publicacao_instituicao (
  id INT AUTO_INCREMENT PRIMARY KEY,
  descricao TEXT NULL,
  foto_perfil VARCHAR(400),
  criado_em TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  atualizado_em TIMESTAMP NULL ON UPDATE CURRENT_TIMESTAMP,
  id_instituicao INT NOT NULL,
  CONSTRAINT fk_publicacao_inst FOREIGN KEY (id_instituicao) REFERENCES tbl_instituicao(id) ON DELETE CASCADE
) ENGINE=InnoDB;

SET FOREIGN_KEY_CHECKS = 1;