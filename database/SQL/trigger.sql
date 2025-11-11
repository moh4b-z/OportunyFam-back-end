
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
        SET NEW.id_status = 3; -- Confirmada Pelo Responsável (ou o que você definir)
    END IF;
END $$
DELIMITER ;

