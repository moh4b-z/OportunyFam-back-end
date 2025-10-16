const { PrismaClient } = require('../../../../prisma/generated/mysql')
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
        // Trazendo dados relacionados para uma visão completa
        return await prismaMySQL.tbl_inscricao_atividade.findMany({
            include: {
                tbl_crianca: { select: { nome: true } },
                tbl_atividades: { select: { titulo: true } },
                tbl_status_inscricao: { select: { nome: true } }
            },
            orderBy: { criado_em: 'desc' }
        })
    } catch (error) {
        console.error("Erro ao buscar todas as inscrições:", error)
        return false
    }
}

// --- SELECT BY ID / READ BY ID ---
async function selectByIdInscricao(id){
    try {
        return await prismaMySQL.tbl_inscricao_atividade.findUnique({
            where: { id: parseInt(id) },
            include: {
                tbl_crianca: { select: { nome: true, data_nascimento: true } },
                tbl_atividades: { select: { titulo: true, id_instituicao: true } },
                tbl_status_inscricao: { select: { nome: true } },
                tbl_responsavel: { select: { id_usuario: true } }
            }
        })
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