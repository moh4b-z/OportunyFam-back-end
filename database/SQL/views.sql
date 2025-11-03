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
  CAST(TIMESTAMPDIFF(YEAR, p.data_nascimento, CURDATE()) AS UNSIGNED) AS idade,
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
  CAST(TIMESTAMPDIFF(YEAR, p.data_nascimento, CURDATE()) AS UNSIGNED) AS idade,
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