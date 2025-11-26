ALTER TABLE tbl_mensagem
ADD COLUMN tipo VARCHAR(50) NOT NULL DEFAULT 'TEXTO' AFTER id_pessoa,
ADD COLUMN audio_url VARCHAR(400) NULL AFTER tipo,
ADD COLUMN audio_duracao INT UNSIGNED NULL AFTER audio_url;


DELIMITER //

-- Exclui a trigger existente
DROP TRIGGER IF EXISTS tg_mensagem_before_insert //

-- Recria a trigger com a nova lógica de fuso horário
CREATE TRIGGER tg_mensagem_before_insert
BEFORE INSERT ON tbl_mensagem
FOR EACH ROW
BEGIN
    -- 1. Garante que o tipo seja 'TEXTO' se não for fornecido
    IF NEW.tipo IS NULL OR NEW.tipo = '' THEN
        SET NEW.tipo = 'TEXTO';
    END IF;

    -- 2. Define o criado_em usando o fuso horário do Brasil
    -- Isso garante o horário correto, contornando a limitação do DEFAULT.
    IF NEW.criado_em IS NULL THEN
        SET NEW.criado_em = CONVERT_TZ(NOW(), 'SYSTEM', 'America/Sao_Paulo');
    END IF;
END //

DELIMITER ;