-- ======================================================================
-- CORREÇÕES / MELHORIAS: Procedures de inserção (com transaction + handler)
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

  DECLARE EXIT HANDLER FOR SQLEXCEPTION
  BEGIN
    ROLLBACK;
    RESIGNAL;
  END;

  START TRANSACTION;

  INSERT INTO tbl_pessoa (nome, email, senha, telefone, foto_perfil, cpf, data_nascimento)
  VALUES (p_nome, p_email, p_senha, p_telefone, p_foto_perfil, p_cpf, p_data_nascimento);

  SET v_pessoa_id = LAST_INSERT_ID();

  INSERT INTO tbl_usuario (id_pessoa, id_sexo, id_tipo_nivel)
  VALUES (v_pessoa_id, p_id_sexo, p_id_tipo_nivel);

  SET v_usuario_id = LAST_INSERT_ID();

  COMMIT;

  -- Retorna o usuário completo pela view (coluna usuario_id)
  SELECT * FROM vw_usuario_completa WHERE usuario_id = v_usuario_id;
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

  DECLARE EXIT HANDLER FOR SQLEXCEPTION
  BEGIN
    ROLLBACK;
    RESIGNAL;
  END;

  START TRANSACTION;

  INSERT INTO tbl_pessoa (nome, email, senha, telefone, foto_perfil, cpf, data_nascimento)
  VALUES (p_nome, p_email, p_senha, p_telefone, p_foto_perfil, p_cpf, p_data_nascimento);

  SET v_pessoa_id = LAST_INSERT_ID();

  INSERT INTO tbl_crianca (id_pessoa, id_sexo)
  VALUES (v_pessoa_id, p_id_sexo);

  SET v_crianca_id = LAST_INSERT_ID();

  COMMIT;

  SELECT * FROM vw_crianca_completa WHERE crianca_id = v_crianca_id;
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

  DECLARE EXIT HANDLER FOR SQLEXCEPTION
  BEGIN
    ROLLBACK;
    RESIGNAL;
  END;

  START TRANSACTION;

  INSERT INTO tbl_pessoa (nome, email, senha, telefone, foto_perfil)
  VALUES (p_nome, p_email, p_senha, p_telefone, p_foto_perfil);

  SET v_pessoa_id = LAST_INSERT_ID();

  INSERT INTO tbl_instituicao (id_pessoa, cnpj, descricao, id_endereco)
  VALUES (v_pessoa_id, p_cnpj, p_descricao, p_id_endereco);

  SET v_instituicao_id = LAST_INSERT_ID();

  COMMIT;

  SELECT * FROM vw_instituicao_completa WHERE instituicao_id = v_instituicao_id;
END $$
DELIMITER ;

-- ======================================================================
-- Procedures de atualização parcial (aceitam parâmetros NULL -> não alteram)
-- ======================================================================
DELIMITER $$

DROP PROCEDURE IF EXISTS sp_atualizar_usuario $$
CREATE PROCEDURE sp_atualizar_usuario (
  IN p_usuario_id INT,            -- id da tabela tbl_usuario
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
  -- Atualiza parcialmente pessoa + campos específicos do usuário
  DECLARE v_pessoa_id INT;

  DECLARE EXIT HANDLER FOR SQLEXCEPTION
  BEGIN
    ROLLBACK;
    RESIGNAL;
  END;

  START TRANSACTION;

  SELECT id_pessoa INTO v_pessoa_id FROM tbl_usuario WHERE id = p_usuario_id;
  IF v_pessoa_id IS NULL THEN
    SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Usuario nao encontrado';
  END IF;

  UPDATE tbl_pessoa
  SET
    nome = COALESCE(p_nome, nome),
    email = COALESCE(p_email, email),
    senha = COALESCE(p_senha, senha),
    telefone = COALESCE(p_telefone, telefone),
    foto_perfil = COALESCE(p_foto_perfil, foto_perfil),
    cpf = COALESCE(p_cpf, cpf),
    data_nascimento = COALESCE(p_data_nascimento, data_nascimento)
  WHERE id = v_pessoa_id;

  UPDATE tbl_usuario
  SET
    id_sexo = COALESCE(p_id_sexo, id_sexo),
    id_tipo_nivel = COALESCE(p_id_tipo_nivel, id_tipo_nivel)
  WHERE id = p_usuario_id;

  COMMIT;

  SELECT * FROM vw_usuario_completa WHERE usuario_id = p_usuario_id;
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

  DECLARE EXIT HANDLER FOR SQLEXCEPTION
  BEGIN
    ROLLBACK;
    RESIGNAL;
  END;

  START TRANSACTION;

  SELECT id_pessoa INTO v_pessoa_id FROM tbl_crianca WHERE id = p_crianca_id;
  IF v_pessoa_id IS NULL THEN
    SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Crianca nao encontrada';
  END IF;

  UPDATE tbl_pessoa
  SET
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

  SELECT * FROM vw_crianca_completa WHERE crianca_id = p_crianca_id;
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

  DECLARE EXIT HANDLER FOR SQLEXCEPTION
  BEGIN
    ROLLBACK;
    RESIGNAL;
  END;

  START TRANSACTION;

  SELECT id_pessoa INTO v_pessoa_id FROM tbl_instituicao WHERE id = p_instituicao_id;
  IF v_pessoa_id IS NULL THEN
    SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Instituicao nao encontrada';
  END IF;

  UPDATE tbl_pessoa
  SET
    nome = COALESCE(p_nome, nome),
    email = COALESCE(p_email, email),
    senha = COALESCE(p_senha, senha),
    telefone = COALESCE(p_telefone, telefone),
    foto_perfil = COALESCE(p_foto_perfil, foto_perfil)
  WHERE id = v_pessoa_id;

  UPDATE tbl_instituicao
  SET
    cnpj = COALESCE(p_cnpj, cnpj),
    descricao = COALESCE(p_descricao, descricao),
    id_endereco = COALESCE(p_id_endereco, id_endereco)
  WHERE id = p_instituicao_id;

  COMMIT;

  SELECT * FROM vw_instituicao_completa WHERE instituicao_id = p_instituicao_id;
END $$
DELIMITER ;

-- ======================================================================
-- Correção / melhoria: procedure de busca de instituições (joins corretos)
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
      -- score simples: prefer match em nome/descricao/endereco
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
  SELECT * FROM filtrada
  ORDER BY (distancia_km IS NULL), distancia_km ASC, score DESC, nome ASC
  LIMIT v_limite OFFSET v_offset;

  SELECT COUNT(*) AS total FROM filtrada;
END $$
DELIMITER ;

DELIMITER $$

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

    -- 1️⃣ Buscar pessoa pelo e-mail
    SELECT id, senha
    INTO v_pessoa_id, v_senha_banco
    FROM tbl_pessoa
    WHERE email = p_email
    LIMIT 1;

    -- Se não encontrar o e-mail → 404
    IF v_pessoa_id IS NULL THEN
        SELECT 404 AS status;
        LEAVE login_proc;
    END IF;

    -- 2️⃣ Verificar senha (o back já envia criptografada)
    IF v_senha_banco <> p_senha THEN
        SELECT 401 AS status;
        LEAVE login_proc;
    END IF;

    -- 3️⃣ Verificar se é USUÁRIO
    SELECT id INTO v_usuario_id
    FROM tbl_usuario
    WHERE id_pessoa = v_pessoa_id
    LIMIT 1;

    IF v_usuario_id IS NOT NULL THEN
        SELECT * FROM vw_usuario_completa WHERE pessoa_id = v_pessoa_id;
        LEAVE login_proc;
    END IF;

    -- 4️⃣ Verificar se é INSTITUIÇÃO
    SELECT id INTO v_instituicao_id
    FROM tbl_instituicao
    WHERE id_pessoa = v_pessoa_id
    LIMIT 1;

    IF v_instituicao_id IS NOT NULL THEN
        SELECT * FROM vw_instituicao_completa WHERE pessoa_id = v_pessoa_id;
        LEAVE login_proc;
    END IF;

    -- 5️⃣ Verificar se é CRIANÇA
    SELECT id INTO v_crianca_id
    FROM tbl_crianca
    WHERE id_pessoa = v_pessoa_id
    LIMIT 1;

    IF v_crianca_id IS NOT NULL THEN
        SELECT * FROM vw_crianca_completa WHERE pessoa_id = v_pessoa_id;
        LEAVE login_proc;
    END IF;

    -- 6️⃣ Caso nenhum tipo seja identificado
    SELECT 500 AS status;

END $$

DELIMITER ;
