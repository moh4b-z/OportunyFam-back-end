DELIMITER $$

CREATE PROCEDURE sp_inserir_usuario (
  IN p_nome VARCHAR(150) NOT NULL,
  IN p_email VARCHAR(150) NOT NULL,
  IN p_senha VARCHAR(256) NOT NULL,
  IN p_telefone VARCHAR(16),
  IN p_foto_perfil VARCHAR(400),
  IN p_cpf VARCHAR(11) NOT NULL,
  IN p_data_nascimento DATE NOT NULL,
  IN u_id_sexo INT NOT NULL,
  IN u_id_tipo_nivel INT NOT NULL
)
BEGIN
  DECLARE v_pessoa_id INT;

  INSERT INTO tbl_pessoa (nome, email, senha, telefone, foto_perfil, cpf, data_nascimento)
  VALUES (
    p_nome,
    p_email, 
    p_senha, 
    p_telefone, 
    p_foto_perfil, 
    p_cpf, 
    p_data_nascimento
    );

  SET v_pessoa_id = LAST_INSERT_ID();

  INSERT INTO tbl_usuario (id_pessoa, id_sexo, id_tipo_nivel)
  VALUES (
    v_pessoa_id, 
    u_id_sexo, 
    p_id_tipo_nivel
    );

  SELECT * FROM vw_detalhes_usuario WHERE id = LAST_INSERT_ID();
END$$

DELIMITER ;


DELIMITER $$

CREATE PROCEDURE sp_inserir_crianca (
  IN p_nome VARCHAR(150) NOT NULL,
  IN p_email VARCHAR(150) NOT NULL,
  IN p_senha VARCHAR(256) NOT NULL,
  IN p_telefone VARCHAR(16),
  IN p_foto_perfil VARCHAR(400),
  IN p_cpf VARCHAR(11) NOT NULL,
  IN p_data_nascimento DATE NOT NULL,
  IN c_id_sexo INT NOT NULL
)
BEGIN
  DECLARE v_pessoa_id INT;

  INSERT INTO tbl_pessoa (nome, email, senha, telefone, foto_perfil, cpf, data_nascimento)
  VALUES (
    p_nome, 
    p_email, 
    p_senha, 
    p_telefone, 
    p_foto_perfil, 
    p_cpf, 
    p_data_nascimento
    );

  SET v_pessoa_id = LAST_INSERT_ID();

  INSERT INTO tbl_crianca (id_pessoa, id_sexo)
  VALUES (v_pessoa_id, c_id_sexo);

  SELECT * FROM vw_crianca_completa WHERE id = LAST_INSERT_ID();
END$$

DELIMITER ;


DELIMITER $$

CREATE PROCEDURE sp_inserir_instituicao (
  IN p_nome VARCHAR(150) NOT NULL,
  IN p_email VARCHAR(150) NOT NULL,
  IN p_senha VARCHAR(256) NOT NULL,
  IN p_telefone VARCHAR(16),
  IN p_foto_perfil VARCHAR(400),
  IN i_cnpj VARCHAR(14) NOT NULL,
  IN i_descricao TEXT,
  IN i_id_endereco INT NOT NULL
)
BEGIN
  DECLARE v_pessoa_id INT;

  INSERT INTO tbl_pessoa (nome, email, senha, telefone, foto_perfil)
  VALUES (p_nome, p_email, p_senha, p_telefone, p_foto_perfil);

  SET v_pessoa_id = LAST_INSERT_ID();

  INSERT INTO tbl_instituicao (id_pessoa, cnpj, descricao, id_endereco)
  VALUES (
    v_pessoa_id, 
    i_cnpj, 
    i_descricao, 
    i_id_endereco
    );

  SELECT * FROM vw_instituicao_completa WHERE id = LAST_INSERT_ID();
END$$

DELIMITER ;





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