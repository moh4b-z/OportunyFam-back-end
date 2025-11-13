const { PrismaClient } = require('../../../../../prisma/generated/client')
const prismaMySQL = new PrismaClient()



// --- INSERT / CREATE ---
async function insertStatusInscricao(statusNome){
    try {
        return await prismaMySQL.tbl_status_inscricao.create({
            data: { nome: statusNome }
        })
    } catch (error) {
        // Erro 1062 = Unique constraint failed (nome já existe)
        console.error("Erro ao inserir status de inscrição:", error)
        return false
    }
}

// --- SELECT ALL / READ ALL ---
async function selectAllStatusInscricao(){
    try {
        return await prismaMySQL.tbl_status_inscricao.findMany({
            orderBy: { id: 'asc' }
        })
    } catch (error) {
        console.error("Erro ao buscar todos os status:", error)
        return false
    }
}

// --- SELECT BY ID / READ BY ID ---
async function selectByIdStatusInscricao(id){
    try {
        return await prismaMySQL.tbl_status_inscricao.findUnique({
            where: { id: parseInt(id) }
        })
    } catch (error) {
        console.error("Erro ao buscar status por ID:", error)
        return false
    }
}

// --- UPDATE / UPDATE ---
async function updateStatusInscricao(id, novoNome){
    try {
        return await prismaMySQL.tbl_status_inscricao.update({
            where: { id: parseInt(id) },
            data: { nome: novoNome }
        })
    } catch (error) {
        console.error("Erro ao atualizar status de inscrição:", error)
        return false
    }
}

// --- DELETE / DELETE ---
async function deleteStatusInscricao(id){
    try {
        // ON DELETE RESTRICT garante que não se delete um status em uso
        await prismaMySQL.tbl_status_inscricao.delete({ where: { id: parseInt(id) } })
        return true
    } catch (error) {
        console.error("Erro ao deletar status de inscrição. Pode haver inscrições ativas usando este status.", error)
        return false
    }
}


module.exports = {
    insertStatusInscricao,
    selectAllStatusInscricao,
    selectByIdStatusInscricao,
    updateStatusInscricao,
    deleteStatusInscricao,
}