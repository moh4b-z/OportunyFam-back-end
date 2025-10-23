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
  nome  VARCHAR(100) NOT NULL,
  icone VARCHAR(300) NOT NULL
) ENGINE=InnoDB;


CREATE TABLE tbl_usuario (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nome VARCHAR(100) NOT NULL,
  foto_perfil VARCHAR(400),
  email VARCHAR(150) NOT NULL UNIQUE,
  telefone VARCHAR(16),
  senha VARCHAR(256) NOT NULL,
  data_nascimento  DATE NOT NULL,
  cpf VARCHAR(11) NOT NULL,
  criado_em TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  atualizado_em TIMESTAMP NULL ON UPDATE CURRENT_TIMESTAMP,
  id_sexo INT NOT NULL,
  id_tipo_nivel INT NOT NULL,
  CONSTRAINT fk_usuario_sexo       FOREIGN KEY (id_sexo)       REFERENCES tbl_sexo(id),
  CONSTRAINT fk_usuario_tipo_nivel FOREIGN KEY (id_tipo_nivel) REFERENCES tbl_tipo_nivel(id)
) ENGINE=InnoDB;

CREATE TABLE tbl_crianca (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nome VARCHAR(150) NOT NULL,
  foto_perfil VARCHAR(400),
  email VARCHAR(150) UNIQUE,
  telefone VARCHAR(16),
  cpf VARCHAR(11) NOT NULL,
  senha VARCHAR(256) NOT NULL,
  data_nascimento DATE NOT NULL,
  criado_em TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  id_sexo INT NOT NULL,
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
  -- coluna geográfica gerada (SRID 4326)
  geo POINT AS (ST_SRID(POINT(longitude, latitude), 4326)) STORED not null,
  atualizado_em TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  criado_em TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
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

CREATE TABLE tbl_instituicao (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nome VARCHAR(200) NOT NULL,
  logo VARCHAR(400),
  cnpj VARCHAR(14) NOT NULL,
  telefone VARCHAR(16) NOT NULL,
  email VARCHAR(150) NOT NULL UNIQUE,
  senha VARCHAR(256) NOT NULL,
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

CREATE TABLE tbl_categoria (
  id   SMALLINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  nome VARCHAR(100) NOT NULL UNIQUE
) ENGINE=InnoDB;

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


CREATE TABLE tbl_status_inscricao (
  id    TINYINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  nome  VARCHAR(50) UNIQUE NOT NULL
) ENGINE=InnoDB;


CREATE TABLE tbl_inscricao_atividade (
  id                     INT AUTO_INCREMENT PRIMARY KEY,
  id_crianca             INT NOT NULL,
  id_atividade           INT NOT NULL, -- Relacionamento com a ATIVIDADE, não mais com a AULA
  id_responsavel         INT NULL DEFAULT NULL,
  id_status              TINYINT UNSIGNED NOT NULL,
  observacao             VARCHAR(300),
  criado_em              TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  atualizado_em          TIMESTAMP NULL ON UPDATE CURRENT_TIMESTAMP,
  
  UNIQUE KEY uk_crianca_atividade (id_crianca, id_atividade),
  
  CONSTRAINT fk_inscativ_crianca FOREIGN KEY (id_crianca)        REFERENCES tbl_crianca(id)          ON DELETE CASCADE,
  CONSTRAINT fk_inscativ_ativ    FOREIGN KEY (id_atividade)      REFERENCES tbl_atividades(id)       ON DELETE CASCADE, -- Chave alterada
  CONSTRAINT fk_inscativ_resp    FOREIGN KEY (id_responsavel)    REFERENCES tbl_responsavel(id)      ON DELETE SET NULL,
  CONSTRAINT fk_inscativ_status  FOREIGN KEY (id_status)         REFERENCES tbl_status_inscricao(id) ON DELETE RESTRICT
) ENGINE=InnoDB;

CREATE TABLE tbl_matricula_aula (
  id                        INT AUTO_INCREMENT PRIMARY KEY,
  id_inscricao_atividade    INT NOT NULL,
  id_aula_atividade         INT NOT NULL,
  presente                  BOOLEAN NOT NULL DEFAULT FALSE,
  nota_observacao           VARCHAR(500),
  criado_em                 TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  atualizado_em             TIMESTAMP NULL ON UPDATE CURRENT_TIMESTAMP,

  -- Garante que o mesmo aluno só seja matriculado uma vez na mesma aula
  UNIQUE KEY uk_matricula_aula (id_inscricao_atividade, id_aula_atividade),

  CONSTRAINT fk_matr_inscricao FOREIGN KEY (id_inscricao_atividade) REFERENCES tbl_inscricao_atividade(id) ON DELETE CASCADE,
  CONSTRAINT fk_matr_aula      FOREIGN KEY (id_aula_atividade)      REFERENCES tbl_aulas_atividade(id)     ON DELETE CASCADE
) ENGINE=InnoDB;


SET FOREIGN_KEY_CHECKS = 1;


DELIMITER $$

DROP TRIGGER IF EXISTS trg_inscricao_atividade_status_insert $$
CREATE TRIGGER trg_inscricao_atividade_status_insert
BEFORE INSERT ON tbl_inscricao_atividade
FOR EACH ROW
BEGIN
    -- Se id_responsavel NÃO for fornecido (NULL), define o status como 'Sugerida Pela Criança' (id=1)
    IF NEW.id_responsavel IS NULL THEN
        SET NEW.id_status = 1;
    -- Se id_responsavel FOR fornecido, define o status como 'Confirmada Pelo Responsável' (id=2)
    ELSE
        SET NEW.id_status = 2;
    END IF;
END$$

DELIMITER ;


-- Views

CREATE OR REPLACE VIEW vw_detalhes_usuario AS
SELECT
    u.id,
    u.nome,
    u.foto_perfil,
    u.email,
    u.senha,
    u.data_nascimento,
    u.cpf,
    u.criado_em,
    u.atualizado_em,
    s.nome AS sexo,
    tn.nivel AS tipo_nivel,
    (
        SELECT
            COALESCE(
                JSON_ARRAYAGG(
                    JSON_OBJECT('id', t.id_crianca, 'nome', t.nome_crianca)
                ),
                JSON_ARRAY()
            )
        FROM (
            SELECT
                r.id_crianca,
                c.nome AS nome_crianca
            FROM tbl_responsavel r
            JOIN tbl_crianca c ON c.id = r.id_crianca
            WHERE r.id_usuario = u.id
            ORDER BY c.nome
        ) AS t
    ) AS criancas_dependentes
FROM tbl_usuario u
JOIN tbl_sexo s ON s.id = u.id_sexo
JOIN tbl_tipo_nivel tn ON tn.id = u.id_tipo_nivel;

CREATE OR REPLACE VIEW vw_instituicao_completa AS
SELECT
  i.id,
  i.nome,
  i.cnpj,
  i.email,
  i.descricao,
  i.criado_em,
  JSON_OBJECT(
    'id',         e.id,
    'cep',        e.cep,
    'logradouro', e.logradouro,
    'numero',     e.numero,
    'complemento',e.complemento,
    'bairro',     e.bairro,
    'cidade',     e.cidade,
    'estado',     e.estado,
    'latitude', e.latitude,
    'longitude', e.longitude
  ) AS endereco,
  (
    SELECT
      COALESCE(
        JSON_ARRAYAGG(JSON_OBJECT('id', t.id, 'nome', t.nome)),
        JSON_ARRAY()
      )
    FROM (
      SELECT ti.id, ti.nome
      FROM tbl_tipo_instituicao ti
      JOIN tbl_instituicao_tipo_instituicao iti
        ON iti.id_tipo_instituicao = ti.id
      WHERE iti.id_instituicao = i.id
      ORDER BY ti.nome
    ) AS t
  ) AS tipos_instituicao
FROM tbl_instituicao i
JOIN tbl_endereco e ON e.id = i.id_endereco;

CREATE OR REPLACE VIEW vw_crianca_completa AS
SELECT
    c.id,
    c.nome,
    c.foto_perfil,
    c.email,
    c.senha,
    c.cpf,
    c.data_nascimento,
    c.criado_em,
    s.nome AS sexo, -- Substitui id_sexo pelo nome do sexo
    (
        SELECT
            COALESCE(
                JSON_ARRAYAGG(
                    JSON_OBJECT(
                        'atividade_id', t.atividade_id,
                        'titulo', t.titulo,
                        'instituicao', t.instituicao,
                        'categoria', t.categoria,
                        'status_inscricao', t.status_inscricao,
                        'data_inscricao', t.data_inscricao
                    )
                ),
                JSON_ARRAY()
            )
        FROM (
            SELECT
                ia.id_atividade AS atividade_id, -- CORREÇÃO: Adicionando o alias 'atividade_id'
                a.titulo,
                i.nome AS instituicao,
                cat.nome AS categoria,
                s_ins.nome AS status_inscricao,
                ia.criado_em AS data_inscricao
            FROM tbl_inscricao_atividade ia
            JOIN tbl_atividades a ON a.id = ia.id_atividade
            JOIN tbl_instituicao i ON i.id = a.id_instituicao
            JOIN tbl_categoria cat ON cat.id = a.id_categoria
            JOIN tbl_status_inscricao s_ins ON s_ins.id = ia.id_status
            WHERE ia.id_crianca = c.id
              AND ia.id_status IN (2, 4) -- Filtrando por 'Confirmada Pelo Responsável' (2) e 'Aprovada' (4)
            ORDER BY ia.criado_em DESC
        ) AS t
    ) AS atividades_matriculadas
FROM tbl_crianca c
JOIN tbl_sexo s ON s.id = c.id_sexo;


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

-- Procedures de busca (com paginação)

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




CREATE OR REPLACE VIEW vw_alunos_aprovados_instituicao AS
  SELECT
    i.id AS instituicao_id,
    i.nome AS instituicao_nome,
    c.id AS crianca_id,
    c.nome AS crianca_nome,
    a.titulo AS atividade_titulo,
    s.nome AS status_inscricao,
    t.criado_em AS data_inscricao
  FROM tbl_instituicao i
  JOIN tbl_atividades a ON a.id_instituicao = i.id
  JOIN tbl_inscricao_atividade t ON t.id_atividade = a.id
  JOIN tbl_crianca c ON c.id = t.id_crianca
  JOIN tbl_status_inscricao s ON s.id = t.id_status
WHERE t.id_status = 4;

CREATE OR REPLACE VIEW vw_alunos_pendente_instituicao AS
  SELECT
    i.id AS instituicao_id,
    i.nome AS instituicao_nome,
    c.id AS crianca_id,
    c.nome AS crianca_nome,
    a.titulo AS atividade_titulo,
    s.nome AS status_inscricao,
    t.criado_em AS data_inscricao
  FROM tbl_instituicao i
  JOIN tbl_atividades a ON a.id_instituicao = i.id
  JOIN tbl_inscricao_atividade t ON t.id_atividade = a.id
  JOIN tbl_crianca c ON c.id = t.id_crianca
  JOIN tbl_status_inscricao s ON s.id = t.id_status
WHERE t.id_status = 3; 