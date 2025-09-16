/**********************************************
 * Schema: Plataforma de Apoio a Famílias (TCC)
 * MySQL DDL (utf8mb4)
 * Versão enxuta e normalizada
 **********************************************/

CREATE DATABASE oportuny;
USE oportuny;

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- ------------------------
-- Tabelas de domínio (Enums normalizados)
-- ------------------------
CREATE TABLE tipo_usuario (
    id_tipo INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(50) UNIQUE NOT NULL
);

CREATE TABLE genero (
    id_genero INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(50) UNIQUE NOT NULL
);

CREATE TABLE tipo_instituicao (
    id_tipo INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(100) UNIQUE NOT NULL
);

CREATE TABLE tipo_documento (
    id_tipo INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(50) UNIQUE NOT NULL
);

CREATE TABLE status_inscricao (
    id_status INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(50) UNIQUE NOT NULL
);

CREATE TABLE presenca (
    id_presenca INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(50) UNIQUE NOT NULL
);

CREATE TABLE status_denuncia (
    id_status INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(50) UNIQUE NOT NULL
);

-- ------------------------
-- Núcleo de usuários
-- ------------------------
CREATE TABLE usuario (
    id_usuario INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(150) NOT NULL,
    email VARCHAR(150) NOT NULL UNIQUE,
    senha VARCHAR(255) NOT NULL, -- hashed
    id_tipo INT NOT NULL, -- FK tipo_usuario
    ativo BOOLEAN DEFAULT TRUE,
    criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    atualizado_em TIMESTAMP NULL ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (id_tipo) REFERENCES tipo_usuario(id_tipo)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE documento (
    id_documento INT AUTO_INCREMENT PRIMARY KEY,
    id_usuario INT NOT NULL,
    id_tipo INT NOT NULL,
    numero VARCHAR(60) NOT NULL,
    arquivo_url VARCHAR(300),
    verificado BOOLEAN DEFAULT FALSE,
    criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (id_usuario) REFERENCES usuario(id_usuario) ON DELETE CASCADE,
    FOREIGN KEY (id_tipo) REFERENCES tipo_documento(id_tipo)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ------------------------
-- Responsáveis e Crianças
-- ------------------------
CREATE TABLE responsavel (
    id_responsavel INT PRIMARY KEY, -- FK usuario
    profissao VARCHAR(120),
    renda_mensal DECIMAL(12,2),
    qtd_membros INT,
    FOREIGN KEY (id_responsavel) REFERENCES usuario(id_usuario) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE crianca (
    id_crianca INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(150) NOT NULL,
    data_nascimento DATE NOT NULL,
    id_genero INT NOT NULL,
    necessidades_especiais TEXT,
    documento_certidao_url VARCHAR(300),
    criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (id_genero) REFERENCES genero(id_genero)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE responsavel_crianca (
    id_responsavel INT NOT NULL,
    id_crianca INT NOT NULL,
    relacao VARCHAR(50) DEFAULT 'outro',
    autoridade VARCHAR(20) DEFAULT 'secundario',
    habilitado BOOLEAN DEFAULT TRUE,
    criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (id_responsavel, id_crianca),
    FOREIGN KEY (id_responsavel) REFERENCES responsavel(id_responsavel) ON DELETE CASCADE,
    FOREIGN KEY (id_crianca) REFERENCES crianca(id_crianca) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ------------------------
-- Instituições
-- ------------------------
CREATE TABLE instituicao (
    id_instituicao INT PRIMARY KEY, -- FK usuario
    cnpj VARCHAR(20) UNIQUE,
    nome_fantasia VARCHAR(200),
    razao_social VARCHAR(200),
    id_tipo INT NOT NULL,
    descricao TEXT,
    site VARCHAR(200),
    email_contato VARCHAR(150),
    gratuito BOOLEAN DEFAULT TRUE,
    criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    atualizado_em TIMESTAMP NULL ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (id_instituicao) REFERENCES usuario(id_usuario) ON DELETE CASCADE,
    FOREIGN KEY (id_tipo) REFERENCES tipo_instituicao(id_tipo)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ------------------------
-- Atividades e inscrições
-- ------------------------
CREATE TABLE atividade (
    id_atividade INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(150) NOT NULL,
    categoria VARCHAR(100) NOT NULL,
    descricao TEXT,
    idade_minima INT,
    idade_maxima INT,
    criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE horario_atividade (
    id_horario INT AUTO_INCREMENT PRIMARY KEY,
    id_instituicao INT NOT NULL,
    id_atividade INT NOT NULL,
    dia_semana VARCHAR(20) NOT NULL,
    hora_inicio TIME NOT NULL,
    hora_fim TIME NOT NULL,
    capacidade INT DEFAULT NULL,
    FOREIGN KEY (id_instituicao) REFERENCES instituicao(id_instituicao) ON DELETE CASCADE,
    FOREIGN KEY (id_atividade) REFERENCES atividade(id_atividade) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE inscricao_atividade (
    id_inscricao INT AUTO_INCREMENT PRIMARY KEY,
    id_crianca INT NOT NULL,
    id_horario INT NOT NULL,
    id_status INT NOT NULL,
    id_presenca INT DEFAULT NULL,
    data_inscricao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (id_crianca) REFERENCES crianca(id_crianca) ON DELETE CASCADE,
    FOREIGN KEY (id_horario) REFERENCES horario_atividade(id_horario) ON DELETE CASCADE,
    FOREIGN KEY (id_status) REFERENCES status_inscricao(id_status),
    FOREIGN KEY (id_presenca) REFERENCES presenca(id_presenca)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ------------------------
-- Denúncias / Auditoria
-- ------------------------
CREATE TABLE denuncia (
    id_denuncia INT AUTO_INCREMENT PRIMARY KEY,
    id_denunciante INT,
    id_instituicao INT DEFAULT NULL,
    id_usuario_denunciado INT DEFAULT NULL,
    id_status INT NOT NULL,
    descricao TEXT,
    criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (id_denunciante) REFERENCES usuario(id_usuario) ON DELETE SET NULL,
    FOREIGN KEY (id_instituicao) REFERENCES instituicao(id_instituicao) ON DELETE SET NULL,
    FOREIGN KEY (id_usuario_denunciado) REFERENCES usuario(id_usuario) ON DELETE SET NULL,
    FOREIGN KEY (id_status) REFERENCES status_denuncia(id_status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

SET FOREIGN_KEY_CHECKS = 1;
