-- ------------------------
-- Dados de domínio
-- ------------------------
INSERT INTO tipo_usuario (nome) VALUES
('responsavel'),
('instituicao'),
('administrador'),
('operador');

INSERT INTO genero (nome) VALUES
('Masculino'),
('Feminino'),
('Outro');

INSERT INTO tipo_instituicao (nome) VALUES
('ONG'),
('Centro Esportivo'),
('Biblioteca'),
('CEU'),
('Escola'),
('Outro');

INSERT INTO tipo_documento (nome) VALUES
('CPF'),
('RG'),
('CNPJ'),
('Certidão'),
('Outro');

INSERT INTO status_inscricao (nome) VALUES
('pendente'),
('confirmada'),
('cancelada'),
('aguardando_lista');

INSERT INTO presenca (nome) VALUES
('presente'),
('ausente'),
('licenca');

INSERT INTO status_denuncia (nome) VALUES
('pendente'),
('em_analise'),
('resolvido'),
('descartado');

-- ------------------------
-- Endereços
-- ------------------------
INSERT INTO endereco (cep, logradouro, numero, complemento, bairro, cidade, estado) VALUES
('01001-000', 'Praça da Sé', '100', '', 'Sé', 'São Paulo', 'SP'),
('20010-000', 'Rua da Assembléia', '50', 'Apto 101', 'Centro', 'Rio de Janeiro', 'RJ');

-- ------------------------
-- Usuários
-- ------------------------
INSERT INTO usuario (nome, email, senha, id_tipo) VALUES
('João Silva', 'joao@gmail.com', 'hashedsenha1', 1), -- responsável
('Maria Oliveira', 'maria@gmail.com', 'hashedsenha2', 1), -- responsável
('Escola ABC', 'contato@escolaabc.com', 'hashedsenha3', 2), -- instituição
('Admin TCC', 'admin@tcc.com', 'hashedsenha4', 3); -- administrador

-- Vincular usuários a endereços
INSERT INTO usuario_endereco (id_usuario, id_endereco, tipo) VALUES
(1, 1, 'principal'),
(2, 2, 'principal'),
(3, 1, 'principal');

-- ------------------------
-- Documentos
-- ------------------------
INSERT INTO documento (id_usuario, id_tipo, numero, verificado) VALUES
(1, 1, '123.456.789-00', TRUE),
(2, 1, '987.654.321-00', TRUE),
(3, 3, '12.345.678/0001-90', TRUE);

-- ------------------------
-- Responsáveis
-- ------------------------
INSERT INTO responsavel (id_responsavel, profissao, renda_mensal, qtd_membros) VALUES
(1, 'Professor', 4000.00, 4),
(2, 'Enfermeira', 3500.00, 3);

-- ------------------------
-- Crianças
-- ------------------------
INSERT INTO crianca (nome, data_nascimento, id_genero, necessidades_especiais) VALUES
('Lucas Silva', '2015-06-10', 1, NULL),
('Ana Oliveira', '2014-09-22', 2, 'Alergia a amendoim');

-- Relacionamento responsavel_crianca
INSERT INTO responsavel_crianca (id_responsavel, id_crianca, relacao, autoridade) VALUES
(1, 1, 'pai', 'principal'),
(2, 2, 'mae', 'principal');

-- ------------------------
-- Instituições
-- ------------------------
INSERT INTO instituicao (id_instituicao, cnpj, nome_fantasia, razao_social, id_tipo, descricao, site, email_contato) VALUES
(3, '12.345.678/0001-90', 'Escola ABC', 'Escola ABC Ltda', 5, 'Escola de Ensino Fundamental', 'www.escolaabc.com', 'contato@escolaabc.com');

-- ------------------------
-- Atividades
-- ------------------------
INSERT INTO atividade (nome, categoria, descricao, idade_minima, idade_maxima) VALUES
('Futebol Infantil', 'esporte', 'Treino de futebol para crianças de 6 a 10 anos', 6, 10),
('Oficina de Leitura', 'educacao', 'Aulas de incentivo à leitura', 7, 12);

-- ------------------------
-- Horários de atividades
-- ------------------------
INSERT INTO horario_atividade (id_instituicao, id_atividade, dia_semana, hora_inicio, hora_fim, capacidade) VALUES
(3, 1, 'seg', '08:00:00', '10:00:00', 20),
(3, 2, 'qua', '14:00:00', '16:00:00', 15);

-- ------------------------
-- Inscrições de crianças
-- ------------------------
INSERT INTO inscricao_atividade (id_crianca, id_horario, id_status) VALUES
(1, 1, 2), -- Lucas confirmado em Futebol Infantil
(2, 2, 1); -- Ana pendente em Oficina de Leitura
