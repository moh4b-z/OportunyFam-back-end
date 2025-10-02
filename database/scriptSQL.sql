-- =========================================
-- OportunyFam - schema + buscas paginadas
-- =========================================

CREATE DATABASE IF NOT EXISTS oportunyfam;
USE oportunyfam;

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- -----------------------
-- Catálogos básicos
-- -----------------------
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
  nome  VARCHAR(100) NOT NULL,
  icone VARCHAR(300) NOT NULL
) ENGINE=InnoDB;

-- -----------------------
-- Usuários / Crianças
-- -----------------------
CREATE TABLE tbl_usuario (
  id               INT AUTO_INCREMENT PRIMARY KEY,
  nome             VARCHAR(100) NOT NULL,
  foto_perfil      VARCHAR(400),
  email            VARCHAR(150) NOT NULL UNIQUE,
  senha            VARCHAR(256) NOT NULL,
  data_nascimento  DATE NOT NULL,
  cpf              VARCHAR(11) NOT NULL,
  criado_em        TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  atualizado_em    TIMESTAMP NULL ON UPDATE CURRENT_TIMESTAMP,
  id_sexo          INT NOT NULL,
  id_tipo_nivel    INT NOT NULL,
  CONSTRAINT fk_usuario_sexo       FOREIGN KEY (id_sexo)       REFERENCES tbl_sexo(id),
  CONSTRAINT fk_usuario_tipo_nivel FOREIGN KEY (id_tipo_nivel) REFERENCES tbl_tipo_nivel(id)
) ENGINE=InnoDB;

CREATE TABLE tbl_crianca (
  id               INT AUTO_INCREMENT PRIMARY KEY,
  nome             VARCHAR(150) NOT NULL,
  foto_perfil      VARCHAR(400),
  email            VARCHAR(150) UNIQUE,
  cpf              VARCHAR(11) NOT NULL,
  senha            VARCHAR(256) NOT NULL,
  data_nascimento  DATE NOT NULL,
  criado_em        TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  id_sexo          INT NOT NULL,
  CONSTRAINT fk_crianca_sexo FOREIGN KEY (id_sexo) REFERENCES tbl_sexo(id)
) ENGINE=InnoDB;

CREATE TABLE tbl_responsavel (
  id          INT AUTO_INCREMENT PRIMARY KEY,
  criado_em   TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  id_usuario  INT NOT NULL,
  id_crianca  INT NOT NULL,
  CONSTRAINT fk_resp_usuario  FOREIGN KEY (id_usuario) REFERENCES tbl_usuario(id) ON DELETE CASCADE,
  CONSTRAINT fk_resp_crianca  FOREIGN KEY (id_crianca) REFERENCES tbl_crianca(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- -----------------------
-- Endereço (com GEO/FT)
-- -----------------------
CREATE TABLE tbl_endereco (
  id           INT AUTO_INCREMENT PRIMARY KEY,
  osm_id       BIGINT,
  nome         VARCHAR(200),
  tipo         VARCHAR(100),
  cep          VARCHAR(9),
  logradouro   VARCHAR(200),
  numero       VARCHAR(20),
  complemento  VARCHAR(100),
  bairro       VARCHAR(100),
  cidade       VARCHAR(100),
  estado       VARCHAR(2),
  telefone     VARCHAR(50),
  "site"         VARCHAR(255),
  latitude     DECIMAL(10,7) NOT NULL,
  longitude    DECIMAL(10,7) NOT NULL,
  -- coluna geográfica gerada (SRID 4326)
  geo          POINT AS (ST_SRID(POINT(longitude, latitude), 4326)) STORED,
  atualizado_em TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  criado_em     TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY uk_end_osm (osm_id),
  SPATIAL INDEX spx_end_geo (geo),
  FULLTEXT KEY ft_end (nome, logradouro, bairro, cidade)
) ENGINE=InnoDB;

CREATE TABLE tbl_usuario_endereco (
  id          INT AUTO_INCREMENT PRIMARY KEY,
  descricao   VARCHAR(500),
  id_usuario  INT NOT NULL,
  id_endereco INT NOT NULL,
  CONSTRAINT fk_uend_usuario  FOREIGN KEY (id_usuario)  REFERENCES tbl_usuario(id)  ON DELETE CASCADE,
  CONSTRAINT fk_uend_endereco FOREIGN KEY (id_endereco) REFERENCES tbl_endereco(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- -----------------------
-- Instituições
-- -----------------------
CREATE TABLE tbl_instituicao (
  id          INT AUTO_INCREMENT PRIMARY KEY,
  nome        VARCHAR(200) NOT NULL,
  logo        VARCHAR(400),
  cnpj        VARCHAR(14) NOT NULL,
  email       VARCHAR(150) NOT NULL UNIQUE,
  senha       VARCHAR(256) NOT NULL,
  descricao   TEXT,
  criado_em   TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  id_endereco INT NOT NULL,
  CONSTRAINT fk_inst_endereco FOREIGN KEY (id_endereco) REFERENCES tbl_endereco(id),
  FULLTEXT KEY ft_inst (nome, descricao)
) ENGINE=InnoDB;

CREATE TABLE tbl_instituicao_endereco (
  id             INT AUTO_INCREMENT PRIMARY KEY,
  descricao      VARCHAR(500),
  id_instituicao INT NOT NULL,
  id_endereco    INT NOT NULL,
  CONSTRAINT fk_iend_inst FOREIGN KEY (id_instituicao) REFERENCES tbl_instituicao(id) ON DELETE CASCADE,
  CONSTRAINT fk_iend_end  FOREIGN KEY (id_endereco)    REFERENCES tbl_endereco(id)    ON DELETE CASCADE
) ENGINE=InnoDB;

-- redes sociais
CREATE TABLE tbl_rede_social_usuario (
  id               INT AUTO_INCREMENT PRIMARY KEY,
  link_perfil      VARCHAR(255),
  link_abreviado   VARCHAR(20),
  numero_telefone  VARCHAR(20),
  descricao        TEXT,
  id_usuario       INT NOT NULL,
  id_rede_social   INT NOT NULL,
  CONSTRAINT fk_rsu_usuario     FOREIGN KEY (id_usuario)     REFERENCES tbl_usuario(id)     ON DELETE CASCADE,
  CONSTRAINT fk_rsu_rede_social FOREIGN KEY (id_rede_social) REFERENCES tbl_rede_social(id)
) ENGINE=InnoDB;

CREATE TABLE tbl_rede_social_instituicao (
  id               INT AUTO_INCREMENT PRIMARY KEY,
  link_perfil      VARCHAR(255),
  link_abreviado   VARCHAR(20),
  numero_telefone  VARCHAR(20),
  descricao        TEXT,
  id_instituicao   INT NOT NULL,
  id_rede_social   INT NOT NULL,
  CONSTRAINT fk_rsi_inst        FOREIGN KEY (id_instituicao) REFERENCES tbl_instituicao(id) ON DELETE CASCADE,
  CONSTRAINT fk_rsi_rede_social FOREIGN KEY (id_rede_social) REFERENCES tbl_rede_social(id)
) ENGINE=InnoDB;

-- -----------------------
-- Tipos de instituição
-- -----------------------
CREATE TABLE tbl_tipo_instituicao (
  id   TINYINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  nome VARCHAR(80) NOT NULL UNIQUE
) ENGINE=InnoDB;

CREATE TABLE tbl_instituicao_tipo_instituicao (
  id                   INT AUTO_INCREMENT PRIMARY KEY,
  id_instituicao       INT NOT NULL,
  id_tipo_instituicao  TINYINT UNSIGNED NOT NULL,
  UNIQUE KEY uk_inst_tipo (id_instituicao, id_tipo_instituicao),
  CONSTRAINT fk_it_inst FOREIGN KEY (id_instituicao)      REFERENCES tbl_instituicao(id)      ON DELETE CASCADE,
  CONSTRAINT fk_it_tipo FOREIGN KEY (id_tipo_instituicao) REFERENCES tbl_tipo_instituicao(id) ON DELETE RESTRICT
) ENGINE=InnoDB;

INSERT IGNORE INTO tbl_tipo_instituicao (nome) VALUES
  ('ONG'),
  ('Escola Pública'),
  ('Escola Privada'),
  ('Centro Esportivo'),
  ('Centro Cultural');

-- -----------------------
-- Categorias / Atividades / Aulas
-- -----------------------
CREATE TABLE tbl_categoria (
  id   SMALLINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
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

CREATE TABLE tbl_atividades (
  id                INT AUTO_INCREMENT PRIMARY KEY,
  id_instituicao    INT NOT NULL,
  id_categoria      SMALLINT UNSIGNED NOT NULL,
  titulo            VARCHAR(140) NOT NULL,
  descricao         TEXT,
  faixa_etaria_min  INT UNSIGNED NOT NULL,
  faixa_etaria_max  INT UNSIGNED NOT NULL,
  gratuita          BOOLEAN NOT NULL DEFAULT TRUE,
  preco             DECIMAL(10,2) NOT NULL DEFAULT 0,
  ativo             BOOLEAN NOT NULL DEFAULT TRUE,
  CONSTRAINT ck_ativ_faixa CHECK (faixa_etaria_min <= faixa_etaria_max),
  CONSTRAINT fk_ativ_inst FOREIGN KEY (id_instituicao) REFERENCES tbl_instituicao(id) ON DELETE CASCADE,
  CONSTRAINT fk_ativ_cat  FOREIGN KEY (id_categoria)   REFERENCES tbl_categoria(id)   ON DELETE RESTRICT,
  FULLTEXT KEY ft_ativ (titulo, descricao)
) ENGINE=InnoDB;

CREATE TABLE tbl_aulas_atividade (
  id                 INT AUTO_INCREMENT PRIMARY KEY,
  id_atividade       INT NOT NULL,
  dia_semana         TINYINT NOT NULL,   -- 1=Dom, 2=Seg...
  hora_inicio        TIME NOT NULL,
  hora_fim           TIME NOT NULL,
  vagas_total        SMALLINT UNSIGNED NOT NULL,
  vagas_disponiveis  SMALLINT UNSIGNED NOT NULL,
  ativo              BOOLEAN NOT NULL DEFAULT TRUE,
  CONSTRAINT ck_aula_horas CHECK (hora_inicio < hora_fim),
  CONSTRAINT fk_aula_ativ  FOREIGN KEY (id_atividade) REFERENCES tbl_atividades(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- -----------------------
-- Inscrições
-- -----------------------
CREATE TABLE tbl_status_inscricao (
  id   TINYINT UNSIGNED PRIMARY KEY,
  nome VARCHAR(40) NOT NULL UNIQUE
) ENGINE=InnoDB;

INSERT IGNORE INTO tbl_status_inscricao (nome) VALUES
  ('pendente'),
  ('aprovada'),
  ('negada'),
  ('cancelada'),
  ('concluida');

CREATE TABLE tbl_inscricao (
  id                 BIGINT AUTO_INCREMENT PRIMARY KEY,
  id_responsavel     INT NOT NULL,
  id_crianca         INT NOT NULL,
  id_aula_atividade  INT NOT NULL,
  id_status          TINYINT UNSIGNED NOT NULL DEFAULT 1,
  observacao         VARCHAR(300),
  criado_em          TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  atualizado_em      TIMESTAMP NULL ON UPDATE CURRENT_TIMESTAMP,
  UNIQUE KEY uk_insc (id_crianca, id_aula_atividade),
  CONSTRAINT fk_insc_crianca  FOREIGN KEY (id_crianca)        REFERENCES tbl_crianca(id)         ON DELETE CASCADE,
  CONSTRAINT fk_insc_aula     FOREIGN KEY (id_aula_atividade) REFERENCES tbl_aulas_atividade(id) ON DELETE CASCADE,
  CONSTRAINT fk_insc_status   FOREIGN KEY (id_status)         REFERENCES tbl_status_inscricao(id) ON DELETE RESTRICT,
  CONSTRAINT fk_insc_resp     FOREIGN KEY (id_responsavel)    REFERENCES tbl_responsavel(id)     ON DELETE CASCADE
) ENGINE=InnoDB;

SET FOREIGN_KEY_CHECKS = 1;

-- -----------------------
-- Views
-- -----------------------
CREATE OR REPLACE VIEW vw_detalhes_usuario AS
SELECT
  u.id, u.nome, u.email, u.data_nascimento, u.cpf, u.criado_em,
  s.nome AS sexo, tn.nivel AS tipo_nivel
FROM tbl_usuario u
JOIN tbl_sexo s       ON s.id  = u.id_sexo
JOIN tbl_tipo_nivel tn ON tn.id = u.id_tipo_nivel;

CREATE OR REPLACE VIEW vw_instituicao_completa AS
SELECT
  i.id, i.nome, i.cnpj, i.email, i.descricao, i.criado_em,
  e.cep, e.logradouro, e.numero, e.complemento, e.bairro, e.cidade, e.estado
FROM tbl_instituicao i
JOIN tbl_instituicao_endereco ie ON ie.id_instituicao = i.id
JOIN tbl_endereco e              ON e.id = ie.id_endereco;

CREATE OR REPLACE VIEW vw_crianca_perfil AS
SELECT
  c.id, c.nome, c.email, c.data_nascimento,
  TIMESTAMPDIFF(YEAR, c.data_nascimento, CURDATE()) AS idade,
  s.nome AS sexo
FROM tbl_crianca c
JOIN tbl_sexo s ON s.id = c.id_sexo;

CREATE OR REPLACE VIEW vw_atividade_detalhe AS
SELECT
  a.id AS atividade_id, a.titulo, a.descricao, a.faixa_etaria_min, a.faixa_etaria_max,
  a.gratuita, a.preco, a.ativo, c.nome AS categoria,
  i.id AS instituicao_id, i.nome AS instituicao,
  e.cidade, e.estado,
  JSON_ARRAYAGG(
    JSON_OBJECT(
      'id', aa.id, 'dia_semana', aa.dia_semana,
      'inicio', aa.hora_inicio, 'fim', aa.hora_fim,
      'vagas_total', aa.vagas_total, 'vagas_disponiveis', aa.vagas_disponiveis
    )
  ) AS horarios
FROM tbl_atividades a
JOIN tbl_categoria  c ON c.id = a.id_categoria
JOIN tbl_instituicao i ON i.id = a.id_instituicao
JOIN tbl_endereco   e ON e.id = i.id_endereco
LEFT JOIN tbl_aulas_atividade aa ON aa.id_atividade = a.id
GROUP BY a.id, a.titulo, a.descricao, a.faixa_etaria_min, a.faixa_etaria_max,
         a.gratuita, a.preco, a.ativo, c.nome, i.id, i.nome, e.cidade, e.estado;

CREATE OR REPLACE VIEW vw_inscricoes AS
SELECT
  ins.id, ins.criado_em, st.nome AS status,
  cri.id AS crianca_id, cri.nome AS crianca,
  TIMESTAMPDIFF(YEAR, cri.data_nascimento, CURDATE()) AS idade,
  atv.id AS atividade_id, atv.titulo AS atividade, cat.nome AS categoria,
  inst.id AS instituicao_id, inst.nome AS instituicao,
  aa.id AS aula_id, aa.dia_semana, aa.hora_inicio, aa.hora_fim
FROM tbl_inscricao ins
JOIN tbl_status_inscricao st ON st.id = ins.id_status
JOIN tbl_crianca cri         ON cri.id = ins.id_crianca
JOIN tbl_aulas_atividade aa  ON aa.id = ins.id_aula_atividade
JOIN tbl_atividades atv      ON atv.id = aa.id_atividade
JOIN tbl_categoria cat       ON cat.id = atv.id_categoria
JOIN tbl_instituicao inst    ON inst.id = atv.id_instituicao;

-- -----------------------
-- Triggers: vagas_disponiveis
-- -----------------------
DELIMITER $$

CREATE TRIGGER trg_insc_ai
AFTER INSERT ON tbl_inscricao
FOR EACH ROW
BEGIN
  IF NEW.id_status = 2 THEN
    UPDATE tbl_aulas_atividade
      SET vagas_disponiveis = GREATEST(vagas_disponiveis - 1, 0)
    WHERE id = NEW.id_aula_atividade;
  END IF;
END$$

CREATE TRIGGER trg_insc_au
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

CREATE TRIGGER trg_insc_ad
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

-- -----------------------
-- Procedures de busca (com paginação)
-- -----------------------
DELIMITER $$

-- Instituições por nome OU endereço; ordena pela distância quando houver lat/lng
DROP PROCEDURE IF EXISTS sp_buscar_instituicoes $$
CREATE PROCEDURE sp_buscar_instituicoes (
  IN p_busca   VARCHAR(200),     -- termo (nome/endereço); pode ser NULL/''
  IN p_lat     DECIMAL(10,7),    -- pode ser NULL
  IN p_lng     DECIMAL(10,7),    -- pode ser NULL
  IN p_raio_km DECIMAL(10,3),    -- pode ser NULL
  IN p_pagina  INT,              -- começa em 1
  IN p_tamanho INT               -- ex.: 20
)
BEGIN
  DECLARE v_limite INT DEFAULT IFNULL(p_tamanho,20);
  DECLARE v_offset INT DEFAULT GREATEST(IFNULL(p_pagina,1)-1,0) * IFNULL(p_tamanho,20);
  DECLARE v_raio_deg DOUBLE;

  IF p_raio_km IS NOT NULL AND p_lat IS NOT NULL AND p_lng IS NOT NULL THEN
    SET v_raio_deg = p_raio_km / 111.32; -- ~km->graus
  END IF;

  WITH base AS (
    SELECT
      i.id, i.nome, i.email, i.cnpj,
      e.logradouro, e.numero, e.bairro, e.cidade, e.estado,
      CASE
        WHEN p_lat IS NOT NULL AND p_lng IS NOT NULL
        THEN ST_Distance_Sphere(e.geo, ST_SRID(POINT(p_lng,p_lat),4326))/1000
        ELSE NULL
      END AS distancia_km,
      COALESCE(MATCH(i.nome, i.descricao) AGAINST (p_busca IN NATURAL LANGUAGE MODE),0)
      + COALESCE(MATCH(e.nome, e.logradouro, e.bairro, e.cidade)
                 AGAINST (p_busca IN NATURAL LANGUAGE MODE),0) AS score
    FROM tbl_instituicao i
    JOIN tbl_endereco e ON e.id = i.id_endereco
    WHERE
      (p_raio_km IS NULL OR p_lat IS NULL OR p_lng IS NULL
       OR MBRWithin(e.geo, ST_Buffer(ST_SRID(POINT(p_lng,p_lat),4326), v_raio_deg)))
      AND (
        p_busca IS NULL OR p_busca = '' OR
        MATCH(i.nome, i.descricao) AGAINST (p_busca IN NATURAL LANGUAGE MODE) OR
        MATCH(e.nome, e.logradouro, e.bairro, e.cidade) AGAINST (p_busca IN NATURAL LANGUAGE MODE) OR
        i.nome LIKE CONCAT('%', p_busca, '%') OR
        e.logradouro LIKE CONCAT('%', p_busca, '%') OR
        e.bairro LIKE CONCAT('%', p_busca, '%') OR
        e.cidade LIKE CONCAT('%', p_busca, '%')
      )
  ),
  filtrada AS (
    SELECT * FROM base
    WHERE (p_raio_km IS NULL OR distancia_km IS NULL OR distancia_km <= p_raio_km)
  )
  SELECT *
  FROM filtrada
  ORDER BY (distancia_km IS NULL), distancia_km ASC, score DESC, nome ASC
  LIMIT v_limite OFFSET v_offset;

  SELECT COUNT(*) AS total FROM filtrada;
END $$

-- Atividades próximas (paginada)
DROP PROCEDURE IF EXISTS sp_buscar_atividades_proximas $$
CREATE PROCEDURE sp_buscar_atividades_proximas (
  IN p_lat DECIMAL(10,7),
  IN p_lng DECIMAL(10,7),
  IN p_raio_km DECIMAL(10,3),
  IN p_idade TINYINT UNSIGNED,
  IN p_gratuita_only BOOLEAN,
  IN p_id_categoria SMALLINT UNSIGNED,
  IN p_pagina INT,
  IN p_tamanho INT
)
BEGIN
  DECLARE v_limite INT DEFAULT IFNULL(p_tamanho,20);
  DECLARE v_offset INT DEFAULT GREATEST(IFNULL(p_pagina,1)-1,0) * IFNULL(p_tamanho,20);
  DECLARE v_raio_deg DOUBLE;

  IF p_raio_km IS NOT NULL THEN
    SET v_raio_deg = p_raio_km / 111.32;
  END IF;

  WITH base AS (
    SELECT
      a.id AS atividade_id, a.titulo, a.descricao,
      a.faixa_etaria_min, a.faixa_etaria_max,
      a.gratuita, a.preco,
      c.nome AS categoria,
      i.id AS instituicao_id, i.nome AS instituicao,
      e.cidade, e.estado,
      ST_Distance_Sphere(e.geo, ST_SRID(POINT(p_lng,p_lat),4326))/1000 AS distancia_km
    FROM tbl_atividades a
    JOIN tbl_categoria  c ON c.id = a.id_categoria
    JOIN tbl_instituicao i ON i.id = a.id_instituicao
    JOIN tbl_endereco   e ON e.id = i.id_endereco
    WHERE a.ativo = TRUE
      AND (p_id_categoria IS NULL OR a.id_categoria = p_id_categoria)
      AND (p_gratuita_only = FALSE OR a.gratuita = TRUE)
      AND (p_idade IS NULL OR (a.faixa_etaria_min <= p_idade AND p_idade <= a.faixa_etaria_max))
      AND (p_raio_km IS NULL OR MBRWithin(e.geo, ST_Buffer(ST_SRID(POINT(p_lng,p_lat),4326), v_raio_deg)))
  ),
  filtrada AS (
    SELECT * FROM base
    WHERE (p_raio_km IS NULL OR distancia_km <= p_raio_km)
  )
  SELECT *
  FROM filtrada
  ORDER BY distancia_km ASC, titulo ASC
  LIMIT v_limite OFFSET v_offset;

  SELECT COUNT(*) AS total FROM filtrada;
END $$
DELIMITER ;

-- -----------------------
-- Exemplos de uso
-- -----------------------
-- CALL sp_buscar_instituicoes('Vila Mariana', -23.55, -46.63, 5, 1, 20);
-- CALL sp_buscar_instituicoes(NULL, -23.55, -46.63, 3, 1, 10);
-- CALL sp_buscar_atividades_proximas(-23.55, -46.63, 5, 12, TRUE, NULL, 1, 20);
