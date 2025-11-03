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



-- Views

CREATE OR REPLACE VIEW vw_conversas_detalhe AS
SELECT
  pc.id_pessoa AS id_remetente,
  c.id AS id_conversa,
  JSON_OBJECT(
    'id', p2.id,
    'nome', p2.nome,
    'foto_perfil', p2.foto_perfil
  ) AS outro_participante,
  (
    SELECT 
      JSON_OBJECT(
        'id', m.id,
        'descricao', m.descricao,
        'data_envio', m.criado_em,
        'id_remetente', m.id_pessoa
      )
    FROM tbl_mensagem m
    WHERE m.id_conversa = c.id
    ORDER BY m.criado_em DESC
    LIMIT 1
  ) AS ultima_mensagem
FROM tbl_conversa c
JOIN tbl_pessoa_conversa pc ON pc.id_conversa = c.id
-- outra pessoa na mesma conversa
JOIN tbl_pessoa_conversa pc2
  ON pc2.id_conversa = c.id
  AND pc2.id_pessoa <> pc.id_pessoa
JOIN tbl_pessoa p2 ON p2.id = pc2.id_pessoa;

CREATE OR REPLACE VIEW vw_alunos_instituicao AS
SELECT
  i.id AS instituicao_id,
  p_i.nome AS instituicao_nome,
  a.id AS atividade_id,
  a.titulo AS atividade_titulo,
  c.id AS crianca_id,
  p_c.nome AS crianca_nome,
  p_c.foto_perfil AS crianca_foto,
  s.id AS status_id,
  s.nome AS status_inscricao,
  t.criado_em AS data_inscricao
FROM tbl_instituicao i
JOIN tbl_pessoa p_i ON p_i.id = i.id_pessoa
JOIN tbl_atividade a ON a.id_instituicao = i.id
JOIN tbl_inscricao_atividade t ON t.id_atividade = a.id
JOIN tbl_crianca c ON c.id = t.id_crianca
JOIN tbl_pessoa p_c ON p_c.id = c.id_pessoa
JOIN tbl_status_inscricao s ON s.id = t.id_status;


CREATE OR REPLACE VIEW vw_aulas_detalhe AS
SELECT
  aa.id AS aula_id,
  aa.id_atividade,
  aa.data_aula,
  aa.hora_inicio,
  aa.hora_fim,
  aa.vagas_total,
  aa.vagas_disponiveis,
  CASE
    WHEN aa.data_aula < CURDATE() THEN 'Encerrada'
    WHEN aa.data_aula = CURDATE() THEN 'Hoje'
    ELSE 'Futura'
  END AS status_aula
FROM tbl_aulas_atividade aa;


CREATE OR REPLACE VIEW vw_atividade_detalhe AS
SELECT
  a.id AS atividade_id,
  a.titulo,
  a.descricao,
  a.faixa_etaria_min,
  a.faixa_etaria_max,
  a.gratuita,
  a.preco,
  a.ativo,
  cat.nome AS categoria,
  i.id AS instituicao_id,
  p_i.nome AS instituicao_nome,
  p_i.foto_perfil AS instituicao_foto,
  e.cidade,
  e.estado,
  (
    SELECT COALESCE(
      JSON_ARRAYAGG(
        JSON_OBJECT(
          'aula_id', ad.aula_id,
          'data', ad.data_aula,
          'hora_inicio', ad.hora_inicio,
          'hora_fim', ad.hora_fim,
          'vagas_total', ad.vagas_total,
          'vagas_disponiveis', ad.vagas_disponiveis,
          'status_aula', ad.status_aula
        )
      ), JSON_ARRAY()
    )
    FROM vw_aulas_detalhe ad
    WHERE ad.id_atividade = a.id
  ) AS aulas
FROM tbl_atividade a
JOIN tbl_categoria cat ON cat.id = a.id_categoria
JOIN tbl_instituicao i ON i.id = a.id_instituicao
JOIN tbl_pessoa p_i ON p_i.id = i.id_pessoa
JOIN tbl_endereco e ON e.id = i.id_endereco;


CREATE OR REPLACE VIEW vw_usuario_completa AS
SELECT
  u.id AS usuario_id,
  p.id AS pessoa_id,
  p.nome,
  p.email,
  p.foto_perfil,
  p.telefone,
  p.cpf,
  p.data_nascimento,
  p.criado_em,
  p.atualizado_em,
  s.nome AS sexo,
  tn.nivel AS tipo_nivel,
  (
    SELECT COALESCE(JSON_ARRAYAGG(
        JSON_OBJECT('id_crianca', c.id, 'nome', p_c.nome)
      ), JSON_ARRAY())
    FROM tbl_responsavel r
    JOIN tbl_crianca c ON c.id = r.id_crianca
    JOIN tbl_pessoa p_c ON p_c.id = c.id_pessoa
    WHERE r.id_usuario = u.id
  ) AS criancas_dependentes,
  (
    SELECT COALESCE(JSON_ARRAYAGG(
        JSON_OBJECT(
          'id_conversa', cd.id_conversa,
          'outro_participante', cd.outro_participante,
          'ultima_mensagem', cd.ultima_mensagem
        )
      ), JSON_ARRAY())
    FROM vw_conversas_detalhe cd
    WHERE cd.id_remetente = p.id
  ) AS conversas
FROM tbl_usuario u
JOIN tbl_pessoa p ON p.id = u.id_pessoa
JOIN tbl_sexo s ON s.id = u.id_sexo
JOIN tbl_tipo_nivel tn ON tn.id = u.id_tipo_nivel;


CREATE OR REPLACE VIEW vw_instituicao_completa AS
SELECT
  ins.id AS instituicao_id,
  p.id AS pessoa_id,
  p.nome,
  p.email,
  p.foto_perfil,
  ins.cnpj,
  ins.descricao,
  p.criado_em,
  p.atualizado_em,
  JSON_OBJECT(
    'id', e.id,
    'cep', e.cep,
    'logradouro', e.logradouro,
    'numero', e.numero,
    'complemento', e.complemento,
    'bairro', e.bairro,
    'cidade', e.cidade,
    'estado', e.estado,
    'latitude', e.latitude,
    'longitude', e.longitude
  ) AS endereco,
  (
    SELECT COALESCE(JSON_ARRAYAGG(
        JSON_OBJECT('id', tp.id, 'nome', tp.nome)
      ), JSON_ARRAY())
    FROM tbl_instituicao_tipo_instituicao iti
    JOIN tbl_tipo_instituicao tp ON tp.id = iti.id_tipo_instituicao
    WHERE iti.id_instituicao = ins.id
  ) AS tipos_instituicao,
  (
    SELECT COALESCE(JSON_ARRAYAGG(
        JSON_OBJECT(
          'id', pub.id,
          'descricao', pub.descricao,
          'foto_perfil', pub.foto_perfil,
          'criado_em', pub.criado_em
        )
      ), JSON_ARRAY())
    FROM tbl_publicacao_instituicao pub
    WHERE pub.id_instituicao = ins.id
  ) AS publicacoes,
  (
    SELECT COALESCE(JSON_ARRAYAGG(
        JSON_OBJECT(
          'id_conversa', cd.id_conversa,
          'outro_participante', cd.outro_participante,
          'ultima_mensagem', cd.ultima_mensagem
        )
      ), JSON_ARRAY())
    FROM vw_conversas_detalhe cd
    WHERE cd.id_remetente = p.id
  ) AS conversas,
  (
    SELECT COALESCE(
        JSON_ARRAYAGG(
          JSON_OBJECT(
            'atividade_id', atv.atividade_id,
            'titulo', atv.titulo,
            'descricao', atv.descricao,
            'faixa_etaria_min', atv.faixa_etaria_min,
            'faixa_etaria_max', atv.faixa_etaria_max,
            'categoria', atv.categoria,
            'aulas', atv.aulas
          )
        ), JSON_ARRAY()
      )
      FROM vw_atividade_detalhe atv
      WHERE atv.instituicao_id = ins.id
  ) AS atividades
FROM tbl_instituicao ins
JOIN tbl_pessoa p ON p.id = ins.id_pessoa
JOIN tbl_endereco e ON e.id = ins.id_endereco;



CREATE OR REPLACE VIEW vw_crianca_completa AS
SELECT
  c.id AS crianca_id,
  p.id AS pessoa_id,
  p.nome,
  p.email,
  p.foto_perfil,
  p.data_nascimento,
  CAST(TIMESTAMPDIFF(YEAR, p.data_nascimento, CURDATE()) AS SIGNED) AS idade,
  p.criado_em,
  p.atualizado_em,
  s.nome AS sexo,
  (
    SELECT COALESCE(
      JSON_ARRAYAGG(
        JSON_OBJECT(
          'atividade_id', a.id,
          'titulo', a.titulo,
          'categoria', c.nome,
          'instituicao', p_i.nome,
          'aulas', ad.aulas
        )
      ), JSON_ARRAY()
    )
    FROM tbl_inscricao_atividade ia
    JOIN tbl_atividade a ON a.id = ia.id_atividade
    JOIN tbl_categoria c ON c.id = a.id_categoria
    JOIN tbl_instituicao i ON i.id = a.id_instituicao
    JOIN tbl_pessoa p_i ON p_i.id = i.id_pessoa
    JOIN vw_atividade_detalhe ad ON ad.atividade_id = a.id
    WHERE ia.id_crianca = c.id
    AND ia.id_status = 4
  ) AS atividades_matriculadas,
  (
    SELECT COALESCE(JSON_ARRAYAGG(
        JSON_OBJECT(
          'id_conversa', cd.id_conversa,
          'outro_participante', cd.outro_participante,
          'ultima_mensagem', cd.ultima_mensagem
        )
      ), JSON_ARRAY())
    FROM vw_conversas_detalhe cd
    WHERE cd.id_remetente = p.id
  ) AS conversas
FROM tbl_crianca c
JOIN tbl_pessoa p ON p.id = c.id_pessoa
JOIN tbl_sexo s ON s.id = c.id_sexo;



CREATE OR REPLACE VIEW vw_usuario_perfil AS
SELECT
  u.id AS usuario_id,
  p.id AS pessoa_id,
  p.nome,
  p.foto_perfil,
  s.nome AS sexo
FROM tbl_usuario u
JOIN tbl_pessoa p ON p.id = u.id_pessoa
JOIN tbl_sexo s ON s.id = u.id_sexo;


CREATE OR REPLACE VIEW vw_instituicao_perfil AS
SELECT
  ins.id AS instituicao_id,
  p.id AS pessoa_id,
  p.nome,
  p.foto_perfil,
  ins.descricao,
  JSON_OBJECT(
    'cidade', e.cidade,
    'estado', e.estado
  ) AS localizacao,
  (
    SELECT COALESCE(JSON_ARRAYAGG(
        JSON_OBJECT(
          'id', pub.id,
          'descricao', pub.descricao,
          'foto_perfil', pub.foto_perfil,
          'criado_em', pub.criado_em
        )
      ), JSON_ARRAY())
    FROM tbl_publicacao_instituicao pub
    WHERE pub.id_instituicao = ins.id
  ) AS publicacoes
FROM tbl_instituicao ins
JOIN tbl_pessoa p ON p.id = ins.id_pessoa
JOIN tbl_endereco e ON e.id = ins.id_endereco;

CREATE OR REPLACE VIEW vw_crianca_perfil AS
SELECT
  c.id AS crianca_id,
  p.id AS pessoa_id,
  p.nome,
  p.foto_perfil,
  s.nome AS sexo,
  CAST(TIMESTAMPDIFF(YEAR, p.data_nascimento, CURDATE()) AS SIGNED) AS idade,
  (
    SELECT COALESCE(
        JSON_ARRAYAGG(
          JSON_OBJECT(
            'atividade_id', atv.atividade_id,
            'titulo', atv.titulo,
            'descricao', atv.descricao,
            'faixa_etaria_min', atv.faixa_etaria_min,
            'faixa_etaria_max', atv.faixa_etaria_max,
            'categoria', atv.categoria,
            'aulas', atv.aulas
          )
        ), JSON_ARRAY()
      )
    FROM vw_atividade_detalhe atv
    JOIN tbl_inscricao_atividade ia ON ia.id_atividade = atv.atividade_id
    WHERE ia.id_crianca = c.id
      AND ia.id_status = 4
  ) AS atividades
FROM tbl_crianca c
JOIN tbl_pessoa p ON p.id = c.id_pessoa
JOIN tbl_sexo s ON s.id = c.id_sexo;

CREATE OR REPLACE VIEW vw_alunos_instituicao AS
SELECT
  i.id AS instituicao_id,
  p_i.nome AS instituicao_nome,
  a.id AS atividade_id,
  a.titulo AS atividade_titulo,
  c.id AS crianca_id,
  p_c.nome AS crianca_nome,
  p_c.foto_perfil AS crianca_foto,
  s.id AS status_id,
  s.nome AS status_inscricao,
  t.criado_em AS data_inscricao
FROM tbl_instituicao i
JOIN tbl_pessoa p_i ON p_i.id = i.id_pessoa
JOIN tbl_atividade a ON a.id_instituicao = i.id
JOIN tbl_inscricao_atividade t ON t.id_atividade = a.id
JOIN tbl_crianca c ON c.id = t.id_crianca
JOIN tbl_pessoa p_c ON p_c.id = c.id_pessoa
JOIN tbl_status_inscricao s ON s.id = t.id_status;



-- ======================================================================
-- Triggers para manter vagas_disponiveis consistentes no cadastro de aulas
--  - Antes de inserir matricula: verifica se há vagas
--  - After insert: decrementa vagas_disponiveis
--  - After delete: incrementa vagas_disponiveis
-- ======================================================================
DELIMITER $$

-- Antes de inserir: checa se há vagas suficientes
DROP TRIGGER IF EXISTS trg_matricula_aula_before_insert $$
CREATE TRIGGER trg_matricula_aula_before_insert
BEFORE INSERT ON tbl_matricula_aula
FOR EACH ROW
BEGIN
  DECLARE v_vagas INT;
  SELECT vagas_disponiveis INTO v_vagas FROM tbl_aulas_atividade WHERE id = NEW.id_aula_atividade FOR UPDATE;
  IF v_vagas IS NULL THEN
    SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Aula nao encontrada';
  END IF;
  IF v_vagas <= 0 THEN
    SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Sem vagas disponiveis para essa aula';
  END IF;
END $$
DELIMITER ;

DELIMITER $$
DROP TRIGGER IF EXISTS trg_matricula_aula_after_insert $$
CREATE TRIGGER trg_matricula_aula_after_insert
AFTER INSERT ON tbl_matricula_aula
FOR EACH ROW
BEGIN
  UPDATE tbl_aulas_atividade
  SET vagas_disponiveis = GREATEST(vagas_disponiveis - 1, 0)
  WHERE id = NEW.id_aula_atividade;
END $$
DELIMITER ;

DELIMITER $$
DROP TRIGGER IF EXISTS trg_matricula_aula_after_delete $$
CREATE TRIGGER trg_matricula_aula_after_delete
AFTER DELETE ON tbl_matricula_aula
FOR EACH ROW
BEGIN
  UPDATE tbl_aulas_atividade
  SET vagas_disponiveis = vagas_disponiveis + 1
  WHERE id = OLD.id_aula_atividade;
END $$
DELIMITER ;

-- ======================================================================
-- Trigger para ajustar vaga se houver atualização que mude id_aula_atividade
-- (caso o sistema permita alterar aula na matrícula)
-- ======================================================================
DELIMITER $$
DROP TRIGGER IF EXISTS trg_matricula_aula_after_update $$
CREATE TRIGGER trg_matricula_aula_after_update
AFTER UPDATE ON tbl_matricula_aula
FOR EACH ROW
BEGIN
  -- Se mudou de aula: devolve uma vaga na antiga e retira uma na nova (validações simples)
  IF OLD.id_aula_atividade <> NEW.id_aula_atividade THEN
    UPDATE tbl_aulas_atividade
      SET vagas_disponiveis = vagas_disponiveis + 1
    WHERE id = OLD.id_aula_atividade;

    -- decrementa nova (garantir não ficar negativo)
    UPDATE tbl_aulas_atividade
      SET vagas_disponiveis = GREATEST(vagas_disponiveis - 1, 0)
    WHERE id = NEW.id_aula_atividade;
  END IF;
END $$
DELIMITER ;

-- ======================================================================
-- Trigger para garantir consistência entre vagas_total e vagas_disponiveis
-- ======================================================================

DELIMITER $$

DROP TRIGGER IF EXISTS trg_aula_atividade_before_insert $$
CREATE TRIGGER trg_aula_atividade_before_insert
BEFORE INSERT ON tbl_aulas_atividade
FOR EACH ROW
BEGIN
  -- Se o usuário não informou vagas_disponiveis, define igual ao total
  IF NEW.vagas_disponiveis IS NULL THEN
    SET NEW.vagas_disponiveis = NEW.vagas_total;
  END IF;

  -- Valida: não pode haver mais vagas disponíveis que o total
  IF NEW.vagas_disponiveis > NEW.vagas_total THEN
    SIGNAL SQLSTATE '45000'
      SET MESSAGE_TEXT = 'vagas_disponiveis nao pode ser maior que vagas_total';
  END IF;

  -- Valida: hora de início deve ser menor que hora de fim
  IF NEW.hora_inicio >= NEW.hora_fim THEN
    SIGNAL SQLSTATE '45000'
      SET MESSAGE_TEXT = 'hora_inicio deve ser menor que hora_fim';
  END IF;
END $$


DROP TRIGGER IF EXISTS trg_aula_atividade_before_update $$
CREATE TRIGGER trg_aula_atividade_before_update
BEFORE UPDATE ON tbl_aulas_atividade
FOR EACH ROW
BEGIN
  IF NEW.vagas_disponiveis > NEW.vagas_total THEN
    SIGNAL SQLSTATE '45000'
      SET MESSAGE_TEXT = 'vagas_disponiveis nao pode ser maior que vagas_total';
  END IF;

  IF NEW.hora_inicio >= NEW.hora_fim THEN
    SIGNAL SQLSTATE '45000'
      SET MESSAGE_TEXT = 'hora_inicio deve ser menor que hora_fim';
  END IF;
END $$

DELIMITER ;


-- ======================================================================
-- Trigger já existente corrigida: inscrição_atividade_status_insert
-- (mantive lógica: se id_responsavel NULL -> status 1, senão 2)
-- ======================================================================
DELIMITER $$
DROP TRIGGER IF EXISTS trg_inscricao_atividade_status_insert $$
CREATE TRIGGER trg_inscricao_atividade_status_insert
BEFORE INSERT ON tbl_inscricao_atividade
FOR EACH ROW
BEGIN
    IF NEW.id_responsavel IS NULL THEN
        SET NEW.id_status = 1; -- Sugerida Pela Criança
    ELSE
        SET NEW.id_status = 2; -- Confirmada Pelo Responsável (ou o que você definir)
    END IF;
END $$
DELIMITER ;

-- ======================================================================
-- Procedures de INSERÇÃO (retornando apenas ID)
-- ======================================================================
DELIMITER $$
DROP PROCEDURE IF EXISTS sp_inserir_usuario $$
CREATE PROCEDURE sp_inserir_usuario (
  IN p_nome VARCHAR(150),
  IN p_email VARCHAR(150),
  IN p_senha VARCHAR(256),
  IN p_telefone VARCHAR(16),
  IN p_foto_perfil VARCHAR(400),
  IN p_cpf VARCHAR(11),
  IN p_data_nascimento DATE,
  IN p_id_sexo INT,
  IN p_id_tipo_nivel INT
)
BEGIN
  DECLARE v_pessoa_id INT;
  DECLARE v_usuario_id INT;
  DECLARE EXIT HANDLER FOR SQLEXCEPTION BEGIN ROLLBACK; RESIGNAL; END;

  START TRANSACTION;

  INSERT INTO tbl_pessoa (nome, email, senha, telefone, foto_perfil, cpf, data_nascimento)
  VALUES (p_nome, p_email, p_senha, p_telefone, p_foto_perfil, p_cpf, p_data_nascimento);
  SET v_pessoa_id = LAST_INSERT_ID();

  INSERT INTO tbl_usuario (id_pessoa, id_sexo, id_tipo_nivel)
  VALUES (v_pessoa_id, p_id_sexo, p_id_tipo_nivel);
  SET v_usuario_id = LAST_INSERT_ID();

  COMMIT;

  -- Retorna APENAS o ID
  SELECT v_usuario_id AS usuario_id;
END $$
DELIMITER ;

DELIMITER $$
DROP PROCEDURE IF EXISTS sp_inserir_crianca $$
CREATE PROCEDURE sp_inserir_crianca (
  IN p_nome VARCHAR(150),
  IN p_email VARCHAR(150),
  IN p_senha VARCHAR(256),
  IN p_telefone VARCHAR(16),
  IN p_foto_perfil VARCHAR(400),
  IN p_cpf VARCHAR(11),
  IN p_data_nascimento DATE,
  IN p_id_sexo INT
)
BEGIN
  DECLARE v_pessoa_id INT;
  DECLARE v_crianca_id INT;
  DECLARE EXIT HANDLER FOR SQLEXCEPTION BEGIN ROLLBACK; RESIGNAL; END;

  START TRANSACTION;

  INSERT INTO tbl_pessoa (nome, email, senha, telefone, foto_perfil, cpf, data_nascimento)
  VALUES (p_nome, p_email, p_senha, p_telefone, p_foto_perfil, p_cpf, p_data_nascimento);
  SET v_pessoa_id = LAST_INSERT_ID();

  INSERT INTO tbl_crianca (id_pessoa, id_sexo)
  VALUES (v_pessoa_id, p_id_sexo);
  SET v_crianca_id = LAST_INSERT_ID();

  COMMIT;

  -- Retorna APENAS o ID
  SELECT v_crianca_id AS crianca_id;
END $$
DELIMITER ;

DELIMITER $$
DROP PROCEDURE IF EXISTS sp_inserir_instituicao $$
CREATE PROCEDURE sp_inserir_instituicao (
  IN p_nome VARCHAR(150),
  IN p_email VARCHAR(150),
  IN p_senha VARCHAR(256),
  IN p_telefone VARCHAR(16),
  IN p_foto_perfil VARCHAR(400),
  IN p_cnpj VARCHAR(14),
  IN p_descricao TEXT,
  IN p_id_endereco INT
)
BEGIN
  DECLARE v_pessoa_id INT;
  DECLARE v_instituicao_id INT;
  DECLARE EXIT HANDLER FOR SQLEXCEPTION BEGIN ROLLBACK; RESIGNAL; END;

  START TRANSACTION;

  INSERT INTO tbl_pessoa (nome, email, senha, telefone, foto_perfil)
  VALUES (p_nome, p_email, p_senha, p_telefone, p_foto_perfil);
  SET v_pessoa_id = LAST_INSERT_ID();

  INSERT INTO tbl_instituicao (id_pessoa, cnpj, descricao, id_endereco)
  VALUES (v_pessoa_id, p_cnpj, p_descricao, p_id_endereco);
  SET v_instituicao_id = LAST_INSERT_ID();

  COMMIT;

  -- Retorna APENAS o ID
  SELECT v_instituicao_id AS instituicao_id;
END $$
DELIMITER ;

-- ======================================================================
-- Procedures de ATUALIZAÇÃO (retornando apenas ID)
-- ======================================================================
DELIMITER $$
DROP PROCEDURE IF EXISTS sp_atualizar_usuario $$
CREATE PROCEDURE sp_atualizar_usuario (
  IN p_usuario_id INT,
  IN p_nome VARCHAR(150),
  IN p_email VARCHAR(150),
  IN p_senha VARCHAR(256),
  IN p_telefone VARCHAR(16),
  IN p_foto_perfil VARCHAR(400),
  IN p_cpf VARCHAR(11),
  IN p_data_nascimento DATE,
  IN p_id_sexo INT,
  IN p_id_tipo_nivel INT
)
BEGIN
  DECLARE v_pessoa_id INT;
  DECLARE EXIT HANDLER FOR SQLEXCEPTION BEGIN ROLLBACK; RESIGNAL; END;

  START TRANSACTION;
  SELECT id_pessoa INTO v_pessoa_id FROM tbl_usuario WHERE id = p_usuario_id;
  IF v_pessoa_id IS NULL THEN
    SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Usuario nao encontrado';
  END IF;

  UPDATE tbl_pessoa SET
    nome = COALESCE(p_nome, nome),
    email = COALESCE(p_email, email),
    senha = COALESCE(p_senha, senha),
    telefone = COALESCE(p_telefone, telefone),
    foto_perfil = COALESCE(p_foto_perfil, foto_perfil),
    cpf = COALESCE(p_cpf, cpf),
    data_nascimento = COALESCE(p_data_nascimento, data_nascimento)
  WHERE id = v_pessoa_id;

  UPDATE tbl_usuario SET
    id_sexo = COALESCE(p_id_sexo, id_sexo),
    id_tipo_nivel = COALESCE(p_id_tipo_nivel, id_tipo_nivel)
  WHERE id = p_usuario_id;

  COMMIT;

  -- Retorna APENAS o ID
  SELECT p_usuario_id AS usuario_id;
END $$
DELIMITER ;

DELIMITER $$
DROP PROCEDURE IF EXISTS sp_atualizar_crianca $$
CREATE PROCEDURE sp_atualizar_crianca (
  IN p_crianca_id INT,
  IN p_nome VARCHAR(150),
  IN p_email VARCHAR(150),
  IN p_senha VARCHAR(256),
  IN p_telefone VARCHAR(16),
  IN p_foto_perfil VARCHAR(400),
  IN p_cpf VARCHAR(11),
  IN p_data_nascimento DATE,
  IN p_id_sexo INT
)
BEGIN
  DECLARE v_pessoa_id INT;
  DECLARE EXIT HANDLER FOR SQLEXCEPTION BEGIN ROLLBACK; RESIGNAL; END;

  START TRANSACTION;
  SELECT id_pessoa INTO v_pessoa_id FROM tbl_crianca WHERE id = p_crianca_id;
  IF v_pessoa_id IS NULL THEN
    SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Crianca nao encontrada';
  END IF;

  UPDATE tbl_pessoa SET
    nome = COALESCE(p_nome, nome),
    email = COALESCE(p_email, email),
    senha = COALESCE(p_senha, senha),
    telefone = COALESCE(p_telefone, telefone),
    foto_perfil = COALESCE(p_foto_perfil, foto_perfil),
    cpf = COALESCE(p_cpf, cpf),
    data_nascimento = COALESCE(p_data_nascimento, data_nascimento)
  WHERE id = v_pessoa_id;

  UPDATE tbl_crianca
  SET id_sexo = COALESCE(p_id_sexo, id_sexo)
  WHERE id = p_crianca_id;

  COMMIT;

  -- Retorna APENAS o ID
  SELECT p_crianca_id AS crianca_id;
END $$
DELIMITER ;

DELIMITER $$
DROP PROCEDURE IF EXISTS sp_atualizar_instituicao $$
CREATE PROCEDURE sp_atualizar_instituicao (
  IN p_instituicao_id INT,
  IN p_nome VARCHAR(150),
  IN p_email VARCHAR(150),
  IN p_senha VARCHAR(256),
  IN p_telefone VARCHAR(16),
  IN p_foto_perfil VARCHAR(400),
  IN p_cnpj VARCHAR(14),
  IN p_descricao TEXT,
  IN p_id_endereco INT
)
BEGIN
  DECLARE v_pessoa_id INT;
  DECLARE EXIT HANDLER FOR SQLEXCEPTION BEGIN ROLLBACK; RESIGNAL; END;

  START TRANSACTION;
  SELECT id_pessoa INTO v_pessoa_id FROM tbl_instituicao WHERE id = p_instituicao_id;
  IF v_pessoa_id IS NULL THEN
    SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Instituicao nao encontrada';
  END IF;

  UPDATE tbl_pessoa SET
    nome = COALESCE(p_nome, nome),
    email = COALESCE(p_email, email),
    senha = COALESCE(p_senha, senha),
    telefone = COALESCE(p_telefone, telefone),
    foto_perfil = COALESCE(p_foto_perfil, foto_perfil)
  WHERE id = v_pessoa_id;

  UPDATE tbl_instituicao SET
    cnpj = COALESCE(p_cnpj, cnpj),
    descricao = COALESCE(p_descricao, descricao),
    id_endereco = COALESCE(p_id_endereco, id_endereco)
  WHERE id = p_instituicao_id;

  COMMIT;

  -- Retorna APENAS o ID
  SELECT p_instituicao_id AS instituicao_id;
END $$
DELIMITER ;

-- ======================================================================
-- Procedures de LEITURA (LOGIN E BUSCA) - ESTAS ESTÃO CORRETAS
-- Elas DEVEM retornar o objeto completo e já listam as colunas.
-- ======================================================================
DELIMITER $$
DROP PROCEDURE IF EXISTS sp_buscar_instituicoes $$
CREATE PROCEDURE sp_buscar_instituicoes (
  IN p_busca   VARCHAR(200),
  IN p_lat     DECIMAL(10,7),
  IN p_lng     DECIMAL(10,7),
  IN p_raio_km DECIMAL(10,3),
  IN p_pagina  INT,
  IN p_tamanho INT
)
BEGIN
  DECLARE v_limite INT DEFAULT IFNULL(p_tamanho,20);
  DECLARE v_offset INT DEFAULT GREATEST(IFNULL(p_pagina,1)-1,0) * IFNULL(p_tamanho,20);
  DECLARE v_raio_deg DOUBLE;

  IF p_raio_km IS NOT NULL AND p_lat IS NOT NULL AND p_lng IS NOT NULL THEN
    SET v_raio_deg = p_raio_km / 111.32;
  END IF;

  WITH base AS (
    SELECT
      i.id,
      p.nome AS nome,
      p.email AS email,
      i.cnpj,
      e.logradouro, e.numero, e.bairro, e.cidade, e.estado,
      CASE
        WHEN p_lat IS NOT NULL AND p_lng IS NOT NULL
        THEN ST_Distance_Sphere(POINT(p_lng,p_lat), POINT(e.longitude, e.latitude))/1000
        ELSE NULL
      END AS distancia_km,
      (CASE WHEN p.nome LIKE CONCAT('%', p_busca, '%') THEN 3 ELSE 0 END)
      + (CASE WHEN i.descricao LIKE CONCAT('%', p_busca, '%') THEN 2 ELSE 0 END)
      + (CASE WHEN e.logradouro LIKE CONCAT('%', p_busca, '%') THEN 1 ELSE 0 END) AS score
    FROM tbl_instituicao i
    JOIN tbl_pessoa p ON p.id = i.id_pessoa
    JOIN tbl_endereco e ON e.id = i.id_endereco
    WHERE
      (p_raio_km IS NULL OR p_lat IS NULL OR p_lng IS NULL
        OR MBRWithin(e.geo, ST_Buffer(ST_SRID(POINT(p_lng,p_lat),4326), v_raio_deg)))
      AND (
        p_busca IS NULL OR p_busca = '' OR
        p.nome LIKE CONCAT('%', p_busca, '%') OR
        i.descricao LIKE CONCAT('%', p_busca, '%') OR
        e.logradouro LIKE CONCAT('%', p_busca, '%') OR
        e.bairro LIKE CONCAT('%', p_busca, '%') OR
        e.cidade LIKE CONCAT('%', p_busca, '%')
      )
  ),
  filtrada AS (
    SELECT * FROM base
    WHERE (p_raio_km IS NULL OR distancia_km IS NULL OR distancia_km <= p_raio_km)
  )
  -- Retorna a busca com colunas explícitas
  SELECT
    id,
    nome,
    email,
    cnpj,
    logradouro,
    numero,
    bairro,
    cidade,
    estado,
    distancia_km,
    score
  FROM filtrada
  ORDER BY (distancia_km IS NULL), distancia_km ASC, score DESC, nome ASC
  LIMIT v_limite OFFSET v_offset;

  -- Retorna a contagem total (esta já estava correta)
  SELECT COUNT(*) AS total FROM filtrada;
END $$
DELIMITER ;

DELIMITER $$
DROP PROCEDURE IF EXISTS sp_login $$
CREATE PROCEDURE sp_login (
    IN p_email VARCHAR(150),
    IN p_senha VARCHAR(256)
)
login_proc:BEGIN
    DECLARE v_pessoa_id INT;
    DECLARE v_senha_banco VARCHAR(256);
    DECLARE v_usuario_id INT;
    DECLARE v_instituicao_id INT;
    DECLARE v_crianca_id INT;

    SELECT id, senha INTO v_pessoa_id, v_senha_banco
    FROM tbl_pessoa WHERE email = p_email LIMIT 1;

    IF v_pessoa_id IS NULL THEN
        SELECT 404 AS status;
        LEAVE login_proc;
    END IF;

    IF v_senha_banco <> p_senha THEN
        SELECT 401 AS status;
        LEAVE login_proc;
    END IF;

    -- USUÁRIO
    SELECT id INTO v_usuario_id
    FROM tbl_usuario WHERE id_pessoa = v_pessoa_id LIMIT 1;

    IF v_usuario_id IS NOT NULL THEN
        SELECT
          usuario_id, pessoa_id, nome, email, foto_perfil, telefone, cpf,
          data_nascimento, criado_em, atualizado_em, sexo, tipo_nivel,
          criancas_dependentes, conversas
        FROM vw_usuario_completa WHERE pessoa_id = v_pessoa_id;
        LEAVE login_proc;
    END IF;

    -- INSTITUIÇÃO
    SELECT id INTO v_instituicao_id
    FROM tbl_instituicao WHERE id_pessoa = v_pessoa_id LIMIT 1;

    IF v_instituicao_id IS NOT NULL THEN
        SELECT
          instituicao_id, pessoa_id, nome, email, foto_perfil, cnpj,
          descricao, criado_em, atualizado_em, endereco, tipos_instituicao,
          publicacoes, conversas, atividades
        FROM vw_instituicao_completa WHERE pessoa_id = v_pessoa_id;
        LEAVE login_proc;
    END IF;

    -- CRIANÇA
    SELECT id INTO v_crianca_id
    FROM tbl_crianca WHERE id_pessoa = v_pessoa_id LIMIT 1;

    IF v_crianca_id IS NOT NULL THEN
        SELECT
          crianca_id, pessoa_id, nome, email, foto_perfil, data_nascimento,
          idade, criado_em, atualizado_em, sexo, atividades_matriculadas, conversas
        FROM vw_crianca_completa WHERE pessoa_id = v_pessoa_id;
        LEAVE login_proc;
    END IF;

    SELECT 500 AS status;
END $$
DELIMITER ;


INSERT INTO tbl_sexo (nome) VALUES
('Feminino'),
('Masculino'),
('Outro'),
('Prefiro não informar');

INSERT INTO tbl_tipo_nivel (nivel) VALUES
('Família (Padrão)'), 
('Instituição (Pend.)'),  
('Instituição (Ativa)'), 
('Admin Master'); 

INSERT INTO tbl_tipo_instituicao (nome) VALUES
  ('ONG'),
  ('Escola Pública'),
  ('Escola Privada'),
  ('Centro Esportivo'),
  ('Centro Cultural')
;

INSERT INTO tbl_categoria (nome) VALUES
  ('Esporte'),
  ('Reforço Escolar'),
  ('Música'),
  ('Dança'),
  ('Teatro'),
  ('Tecnologia'),
  ('Artes Visuais');

INSERT INTO tbl_status_inscricao (nome) VALUES
  ('Sugerida Pela Criança'),
  ('Cancelada'),
  ('Pendente'),
  ('Aprovada'),
  ('Negada');