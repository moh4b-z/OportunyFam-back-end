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
  DECLARE v_limite INT DEFAULT IFNULL(p_tamanho, 20);
  DECLARE v_offset INT DEFAULT GREATEST(IFNULL(p_pagina, 1) - 1, 0) * IFNULL(p_tamanho, 20);
  DECLARE v_raio_deg DOUBLE;

  -- Converte km para graus (aproximação) se houver geolocalização
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
      
      -- Cálculo de Distância (Mantém NULL se não houver lat/lng)
      CASE
        WHEN p_lat IS NOT NULL AND p_lng IS NOT NULL
        THEN ST_Distance_Sphere(POINT(p_lng, p_lat), POINT(e.longitude, e.latitude)) / 1000
        ELSE NULL
      END AS distancia_km,

      -- Cálculo de Score (Relevância)
      -- Dica: Você pode aumentar o peso do nome se quiser garantir ainda mais prioridade
      (CASE WHEN p.nome LIKE CONCAT('%', p_busca, '%') THEN 3 ELSE 0 END) +
      (CASE WHEN i.descricao LIKE CONCAT('%', p_busca, '%') THEN 2 ELSE 0 END) +
      (CASE WHEN e.logradouro LIKE CONCAT('%', p_busca, '%') THEN 1 ELSE 0 END) AS score
    
    FROM tbl_instituicao i
    JOIN tbl_pessoa p ON p.id = i.id_pessoa
    JOIN tbl_endereco e ON e.id = i.id_endereco
    WHERE
      -- Filtro de Raio (Geoespacial)
      (p_raio_km IS NULL OR p_lat IS NULL OR p_lng IS NULL
        OR MBRWithin(e.geo, ST_Buffer(ST_SRID(POINT(p_lng, p_lat), 4326), v_raio_deg)))
      AND (
        -- Filtro de Texto (Nome, Descrição, Endereço)
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
  
  -- Retorna os dados ordenados
  SELECT
    id, nome, email, cnpj, logradouro, numero, bairro, cidade, estado, distancia_km, score
  FROM filtrada
  -- AQUI ESTÁ A CORREÇÃO PRINCIPAL:
  ORDER BY 
    score DESC,                   -- 1º: Mais relevante (nome) primeiro
    (distancia_km IS NULL),       -- 2º: Se tiver distância calculada, prioriza
    distancia_km ASC,             -- 3º: Menor distância
    nome ASC                      -- 4º: Ordem alfabética para empates
  LIMIT v_limite OFFSET v_offset;

  -- Retorna a contagem total para paginação
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