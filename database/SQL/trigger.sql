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
