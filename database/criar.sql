-- Inserção de dados para tbl_sexo
INSERT INTO tbl_sexo (nome) VALUES
('Feminino'),
('Masculino'),
('Outro'),
('Prefiro não informar');

-- Inserção de dados para tbl_tipo_nivel
INSERT INTO tbl_tipo_nivel (nivel) VALUES
('Família (Padrão)'),     -- Nível padrão para usuários comuns (pais/responsáveis)
('Instituição (Pend.)'),  -- Para instituições que aguardam aprovação/validação
('Instituição (Ativa)'),  -- Para instituições validadas e ativas
('Admin Master');         -- Nível máximo de administrador do sistema
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