const { PrismaClient } = require('@prisma/client')
const prismaMySQL = new PrismaClient()

/**
 * Módulo CRUD para a tabela tbl_inscricao_atividade
 */

// --- INSERT / CREATE ---
async function insertInscricaoAtividade(dadosInscricao){
    try {
        // O id_status é definido pelo TRIGGER no banco com base no id_responsavel
        const novaInscricao = {
            id_crianca: dadosInscricao.id_crianca,
            id_atividade: dadosInscricao.id_atividade,
            id_responsavel: dadosInscricao.id_responsavel || null, // TRIGGER usa isso
            observacao: dadosInscricao.observacao || null
        }
        return await prismaMySQL.tbl_inscricao_atividade.create({
            data: novaInscricao
        })
    } catch (error) {
        // Erro 1062 = Unique constraint failed (criança já inscrita nesta atividade)
        console.error("Erro ao inserir inscrição de atividade:", error)
        return false
    }
}

// --- SELECT ALL / READ ALL (Opcional, busca por atividade é mais comum) ---
async function selectAllInscricoes(){
    try {
        // Usando a view vw_alunos_instituicao que já traz os dados relacionados
        return await prismaMySQL.$queryRaw`
            SELECT
                t.id as inscricao_id,
                i.instituicao_id,
                i.instituicao_nome,
                i.atividade_id,
                i.atividade_titulo,
                i.crianca_id,
                i.crianca_nome,
                i.crianca_foto,
                i.status_id,
                i.status_inscricao,
                i.data_inscricao,
                t.observacao,
                t.id_responsavel
            FROM tbl_inscricao_atividade t
            JOIN vw_alunos_instituicao i ON 
                i.crianca_id = t.id_crianca AND
                i.atividade_id = t.id_atividade
            ORDER BY t.criado_em DESC
        `
    } catch (error) {
        console.error("Erro ao buscar todas as inscrições:", error)
        return false
    }
}

// --- SELECT BY ID / READ BY ID ---
async function selectByIdInscricao(id){
    try {
        const result = await prismaMySQL.$queryRaw`
            SELECT
                t.id as inscricao_id,
                i.instituicao_id,
                i.instituicao_nome,
                i.atividade_id,
                i.atividade_titulo,
                i.crianca_id,
                i.crianca_nome,
                i.crianca_foto,
                i.status_id,
                i.status_inscricao,
                i.data_inscricao,
                t.observacao,
                t.id_responsavel,
                COALESCE(
                    JSON_ARRAYAGG(
                        JSON_OBJECT(
                            'aula_id', ma.id,
                            'presente', ma.presente,
                            'nota_observacao', ma.nota_observacao,
                            'criado_em', ma.criado_em,
                            'atualizado_em', ma.atualizado_em
                        )
                    ),
                    '[]'
                ) as matriculas
            FROM tbl_inscricao_atividade t
            JOIN vw_alunos_instituicao i ON 
                i.crianca_id = t.id_crianca AND
                i.atividade_id = t.id_atividade
            LEFT JOIN tbl_matricula_aula ma ON ma.id_inscricao_atividade = t.id
            WHERE t.id = ${parseInt(id)}
            GROUP BY t.id
        `
        return result.length > 0 ? result[0] : null
    } catch (error) {
        console.error("Erro ao buscar inscrição por ID:", error)
        return false
    }
}

// --- UPDATE / UPDATE (Pode ser usado para atualizar o status ou observação) ---
async function updateInscricao(id, novosDados){
    try {
        // Se id_responsavel for atualizado de NULL para um ID, o TRIGGER NÃO será reativado no UPDATE por padrão.
        // A atualização de status deve ser feita diretamente.
        return await prismaMySQL.tbl_inscricao_atividade.update({
            where: { id: parseInt(id) },
            data: {
                id_status: novosDados.id_status ? parseInt(novosDados.id_status) : undefined,
                id_responsavel: novosDados.id_responsavel ? parseInt(novosDados.id_responsavel) : undefined,
                observacao: novosDados.observacao
            }
        })
    } catch (error) {
        console.error("Erro ao atualizar inscrição:", error)
        return false
    }
}

// --- DELETE / DELETE ---
async function deleteInscricao(id){
    try {
        await prismaMySQL.tbl_inscricao_atividade.delete({ where: { id: parseInt(id) } })
        return true
    } catch (error) {
        console.error("Erro ao deletar inscrição:", error)
        return false
    }
}

module.exports = {
    insertInscricaoAtividade,
    selectAllInscricoes,
    selectByIdInscricao,
    updateInscricao,
    deleteInscricao
}