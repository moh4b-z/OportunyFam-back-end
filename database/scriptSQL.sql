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
    osm_id BIGINT, -- ID do objeto no OpenStreetMap
    nome VARCHAR(200), -- Nome do local (ex: Escola Municipal X)
    tipo VARCHAR(100), -- Tipo do local (school, community_centre, etc)
    cep VARCHAR(9),
    logradouro VARCHAR(200),
    numero VARCHAR(20),
    complemento VARCHAR(100),
    bairro VARCHAR(100),
    cidade VARCHAR(100),
    estado VARCHAR(2),
    telefone VARCHAR(50),
    site VARCHAR(255),
    latitude DECIMAL(10, 7) NOT NULL,
    longitude DECIMAL(10, 7) NOT NULL,
    atualizado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE KEY (osm_id) -- evita duplicados do mesmo ponto do OSM
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


USE oportunyfam;


CREATE TABLE IF NOT EXISTS tbl_tipo_instituicao (
  id TINYINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  nome VARCHAR(80) NOT NULL UNIQUE
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS tbl_instituicao_tipo_instituicao (
  id INT AUTO_INCREMENT PRIMARY KEY,
  id_instituicao INT NOT NULL,
  id_tipo_instituicao TINYINT UNSIGNED NOT NULL,
  UNIQUE KEY uk_inst_tipo (id_instituicao, id_tipo_instituicao),
  CONSTRAINT fk_it_instituicao FOREIGN KEY (id_instituicao)
    REFERENCES tbl_instituicao(id) ON DELETE CASCADE,
  CONSTRAINT fk_it_tipo FOREIGN KEY (id_tipo_instituicao)
    REFERENCES tbl_tipo_instituicao(id) ON DELETE RESTRICT
) ENGINE=InnoDB;

-- Sementes comuns (ajuste livre)
INSERT IGNORE INTO tbl_tipo_instituicao (nome) VALUES
 ('ONG'),
 ('Escola Pública'),
 ('Escola Privada'),
 ('Centro Esportivo'),
 ('Centro Cultural');


CREATE TABLE IF NOT EXISTS tbl_categoria (
  id SMALLINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  nome VARCHAR(100) NOT NULL UNIQUE
) ENGINE=InnoDB;

INSERT IGNORE INTO tbl_categoria (nome) VALUES
 ('Esporte'),
 ('Reforço Escolar'),
 ('Música'),
 ('Dança'),
 ('Teatro'),
 ('Tecnologia'),
 ('Artes Visuais');


CREATE TABLE IF NOT EXISTS tbl_atividades (
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
  CONSTRAINT fk_ativ_inst FOREIGN KEY (id_instituicao)
    REFERENCES tbl_instituicao(id) ON DELETE CASCADE,
  CONSTRAINT fk_ativ_cat FOREIGN KEY (id_categoria)
    REFERENCES tbl_categoria(id) ON DELETE RESTRICT
) ENGINE=InnoDB;

-- Busca textual rápida por título/descrição
ALTER TABLE tbl_atividades
  ADD FULLTEXT KEY ft_ativ (titulo, descricao);


CREATE TABLE IF NOT EXISTS tbl_aulas_atividade (
  id INT AUTO_INCREMENT PRIMARY KEY,
  id_atividade INT NOT NULL,
  dia_semana TINYINT NOT NULL,         --1 domingo, 2 segunda, assim vai
  hora_inicio TIME NOT NULL,
  hora_fim TIME NOT NULL,
  vagas_total SMALLINT UNSIGNED NOT NULL,
  vagas_disponiveis SMALLINT UNSIGNED NOT NULL,
  ativo BOOLEAN NOT NULL DEFAULT TRUE,
  CONSTRAINT ck_aula_horas CHECK (hora_inicio < hora_fim),
  CONSTRAINT fk_aula_ativ FOREIGN KEY (id_atividade)
    REFERENCES tbl_atividades(id) ON DELETE CASCADE
) ENGINE=InnoDB;


CREATE TABLE IF NOT EXISTS tbl_status_inscricao (
  id TINYINT UNSIGNED PRIMARY KEY,
  nome VARCHAR(40) NOT NULL UNIQUE
) ENGINE=InnoDB;

INSERT IGNORE INTO tbl_status_inscricao (nome) VALUES
 ('pendente'),
 ('aprovada'),
 ('negada'),
 ('cancelada'),
 ('concluida');

CREATE TABLE IF NOT EXISTS tbl_inscricao (
  id BIGINT AUTO_INCREMENT PRIMARY KEY,
  id_responsavel INT NOT NULL,
  id_crianca INT NOT NULL,
  id_aula_atividade INT NOT NULL,
  id_status TINYINT UNSIGNED NOT NULL DEFAULT 1,
  observacao VARCHAR(300),
  criado_em TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  atualizado_em TIMESTAMP NULL ON UPDATE CURRENT_TIMESTAMP,
  UNIQUE KEY uk_insc (id_crianca, id_aula_atividade),
  CONSTRAINT fk_insc_crianca FOREIGN KEY (id_crianca)
    REFERENCES tbl_crianca(id) ON DELETE CASCADE,
  CONSTRAINT fk_insc_aula FOREIGN KEY (id_aula_atividade)
    REFERENCES tbl_aulas_atividade(id) ON DELETE CASCADE,
  CONSTRAINT fk_insc_status FOREIGN KEY (id_status)
    REFERENCES tbl_status_inscricao(id) ON DELETE RESTRICT
CONSTRAINT fk_aut_resp FOREIGN KEY (id_responsavel)
    REFERENCES tbl_responsavel(id) ON DELETE CASCADE,
) ENGINE=InnoDB;


ALTER TABLE tbl_endereco
  ADD COLUMN IF NOT EXISTS geo POINT
    AS (ST_SRID(POINT(longitude, latitude), 4326)) STORED;

ALTER TABLE tbl_endereco
  ADD SPATIAL INDEX IF NOT EXISTS spx_endereco_geo (geo);

-- Ajuda em buscas de texto por endereço/inst.
ALTER TABLE tbl_endereco
  ADD FULLTEXT KEY IF NOT EXISTS ft_end (nome, logradouro, bairro, cidade);

ALTER TABLE tbl_instituicao
  ADD FULLTEXT KEY IF NOT EXISTS ft_inst (nome, descricao);

DELIMITER $$

-- Distância Haversine em KM
CREATE FUNCTION IF NOT EXISTS fn_distance_km(
  p_lat1 DECIMAL(10,7), p_lng1 DECIMAL(10,7),
  p_lat2 DECIMAL(10,7), p_lng2 DECIMAL(10,7)
) RETURNS DECIMAL(10,3) DETERMINISTIC
BEGIN
  RETURN 6371 * ACOS(
    COS(RADIANS(p_lat1)) * COS(RADIANS(p_lat2)) *
    COS(RADIANS(p_lng2) - RADIANS(p_lng1)) +
    SIN(RADIANS(p_lat1)) * SIN(RADIANS(p_lat2))
  );
END$$

-- Idade em anos (útil nas views)
CREATE FUNCTION IF NOT EXISTS fn_idade(p_nasc DATE)
RETURNS INT DETERMINISTIC
BEGIN
  RETURN TIMESTAMPDIFF(YEAR, p_nasc, CURDATE());
END$$

-- Busca de ATIVIDADES por proximidade + filtros comuns
CREATE PROCEDURE IF NOT EXISTS sp_buscar_atividades_proximas (
  IN p_lat DECIMAL(10,7),
  IN p_lng DECIMAL(10,7),
  IN p_raio_km DECIMAL(10,3),
  IN p_idade TINYINT UNSIGNED,
  IN p_gratuita_only BOOLEAN,
  IN p_id_categoria SMALLINT UNSIGNED
)
BEGIN
  SELECT
    a.id                AS atividade_id,
    a.titulo,
    a.descricao,
    a.faixa_etaria_min,
    a.faixa_etaria_max,
    a.gratuita,
    a.preco,
    c.nome              AS categoria,
    i.id                AS instituicao_id,
    i.nome              AS instituicao,
    e.cidade,
    e.estado,
    fn_distance_km(p_lat, p_lng, e.latitude, e.longitude) AS distancia_km
  FROM tbl_atividades a
  JOIN tbl_categoria c   ON c.id = a.id_categoria
  JOIN tbl_instituicao i ON i.id = a.id_instituicao
  JOIN tbl_endereco e    ON e.id = i.id_endereco
  WHERE a.ativo = TRUE
    AND (p_id_categoria IS NULL OR a.id_categoria = p_id_categoria)
    AND (p_gratuita_only = FALSE OR a.gratuita = TRUE)
    AND (p_idade IS NULL OR (a.faixa_etaria_min <= p_idade AND p_idade <= a.faixa_etaria_max))
  HAVING distancia_km <= IFNULL(p_raio_km, 99999)
  ORDER BY distancia_km, a.titulo
  LIMIT 200;
END$$

-- Efetivar inscrição com checagem de vagas (deixa o ajuste das vagas ao trigger)
CREATE PROCEDURE IF NOT EXISTS sp_efetivar_inscricao (
  IN p_id_crianca INT,
  IN p_id_aula INT
)
BEGIN
  DECLARE v_disp INT DEFAULT 0;
  SELECT vagas_disponiveis INTO v_disp
    FROM tbl_aulas_atividade WHERE id = p_id_aula FOR UPDATE;

  IF v_disp <= 0 THEN
    SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Sem vagas disponíveis';
  ELSE
    -- status 2 = aprovada
    INSERT INTO tbl_inscricao (id_crianca, id_aula_atividade, id_status)
    VALUES (p_id_crianca, p_id_aula, 2);
  END IF;
END$$

DELIMITER ;

-- =========================================================
-- 10) TRIGGERS para manter vagas_disponiveis
--     (considera id_status = 2 como "aprovada")
-- =========================================================
DELIMITER $$

CREATE TRIGGER IF NOT EXISTS trg_insc_ai
AFTER INSERT ON tbl_inscricao
FOR EACH ROW
BEGIN
  IF NEW.id_status = 2 THEN
    UPDATE tbl_aulas_atividade
      SET vagas_disponiveis = GREATEST(vagas_disponiveis - 1, 0)
    WHERE id = NEW.id_aula_atividade;
  END IF;
END$$

CREATE TRIGGER IF NOT EXISTS trg_insc_au
AFTER UPDATE ON tbl_inscricao
FOR EACH ROW
BEGIN
  IF OLD.id_status <> 2 AND NEW.id_status = 2 THEN
    UPDATE tbl_aulas_atividade
      SET vagas_disponiveis = GREATEST(vagas_disponiveis - 1, 0)
    WHERE id = NEW.id_aula_atividade;
  ELSEIF OLD.id_status = 2 AND NEW.id_status <> 2 THEN
    UPDATE tbl_aulas_atividade
      SET vagas_disponiveis = LEAST(vagas_disponiveis + 1, vagas_total)
    WHERE id = NEW.id_aula_atividade;
  END IF;
END$$

CREATE TRIGGER IF NOT EXISTS trg_insc_ad
AFTER DELETE ON tbl_inscricao
FOR EACH ROW
BEGIN
  IF OLD.id_status = 2 THEN
    UPDATE tbl_aulas_atividade
      SET vagas_disponiveis = LEAST(vagas_disponiveis + 1, vagas_total)
    WHERE id = OLD.id_aula_atividade;
  END IF;
END$$

DELIMITER ;

-- =========================================================
-- 11) VIEWS para GETs do backend
-- =========================================================

-- Perfil de criança (com sexo e idade)
CREATE OR REPLACE VIEW vw_crianca_perfil AS
SELECT
  c.id,
  c.nome,
  c.email,
  c.data_nascimento,
  fn_idade(c.data_nascimento) AS idade,
  s.nome AS sexo
FROM tbl_crianca c
JOIN tbl_sexo s ON s.id = c.id_sexo;

-- Detalhe de atividade com horários (JSON)
CREATE OR REPLACE VIEW vw_atividade_detalhe AS
SELECT
  a.id                AS atividade_id,
  a.titulo,
  a.descricao,
  a.faixa_etaria_min,
  a.faixa_etaria_max,
  a.gratuita,
  a.preco,
  a.ativo,
  c.nome              AS categoria,
  i.id                AS instituicao_id,
  i.nome              AS instituicao,
  e.cidade, e.estado,
  JSON_ARRAYAGG(
    JSON_OBJECT(
      'id', aa.id,
      'dia_semana', aa.dia_semana,
      'inicio', aa.hora_inicio,
      'fim', aa.hora_fim,
      'vagas_total', aa.vagas_total,
      'vagas_disponiveis', aa.vagas_disponiveis
    )
  ) AS horarios
FROM tbl_atividades a
JOIN tbl_categoria c   ON c.id = a.id_categoria
JOIN tbl_instituicao i ON i.id = a.id_instituicao
JOIN tbl_endereco e    ON e.id = i.id_endereco
LEFT JOIN tbl_aulas_atividade aa ON aa.id_atividade = a.id
GROUP BY a.id;

-- Inscrições detalhadas (para listagens e relatórios)
CREATE OR REPLACE VIEW vw_inscricoes AS
SELECT
  ins.id,
  ins.criado_em,
  st.nome                   AS status,
  cri.id                    AS crianca_id,
  cri.nome                  AS crianca,
  fn_idade(cri.data_nascimento) AS idade,
  atv.id                    AS atividade_id,
  atv.titulo                AS atividade,
  cat.nome                  AS categoria,
  inst.id                   AS instituicao_id,
  inst.nome                 AS instituicao,
  aa.id                     AS aula_id,
  aa.dia_semana,
  aa.hora_inicio,
  aa.hora_fim
FROM tbl_inscricao ins
JOIN tbl_status_inscricao st ON st.id = ins.id_status
JOIN tbl_crianca cri          ON cri.id = ins.id_crianca
JOIN tbl_aulas_atividade aa   ON aa.id = ins.id_aula_atividade
JOIN tbl_atividades atv       ON atv.id = aa.id_atividade
JOIN tbl_categoria cat        ON cat.id = atv.id_categoria
JOIN tbl_instituicao inst     ON inst.id = atv.id_instituicao;

-- Instituição + tipos agregados (JSON) + endereço
CREATE OR REPLACE VIEW vw_instituicao_com_tipos AS
SELECT
  i.id,
  i.nome,
  i.cnpj,
  i.email,
  i.descricao,
  e.cidade, e.estado, e.bairro, e.logradouro, e.numero,
  COALESCE(JSON_ARRAYAGG(JSON_OBJECT('id', ti.id, 'nome', ti.nome)), JSON_ARRAY()) AS tipos
FROM tbl_instituicao i
JOIN tbl_endereco e ON e.id = i.id_endereco
LEFT JOIN tbl_instituicao_tipo_instituicao iti ON iti.id_instituicao = i.id
LEFT JOIN tbl_tipo_instituicao ti ON ti.id = iti.id_tipo_instituicao
GROUP BY i.id;

-- =========================================================
-- 12) EXEMPLOS DE USO (para referência rápida)
-- =========================================================
-- Buscar atividades próximas (5 km, idade 12, somente gratuitas, qualquer categoria):
-- CALL sp_buscar_atividades_proximas(-23.5505, -46.6333, 5, 12, TRUE, NULL);

-- Efetivar inscrição (com checagem de vagas e ajuste automático por trigger):
-- CALL sp_efetivar_inscricao( :id_crianca, :id_aula );

