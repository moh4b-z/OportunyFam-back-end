const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

// Inserir conversa
async function insertConversa(conversa) {
    try {
        const nova = await prisma.conversas.create({
            data: {
                participantes: conversa.participantes, // array de NumberInt
                atualizado_em: new Date()
            }
        })
        return nova
    } catch (error) {
        console.error("Erro ao inserir conversa:", error)
        return false
    }
}

// Atualizar conversa
async function updateConversa(conversa) {
    try {
        const atualizado = await prisma.conversas.update({
            where: { id: conversa.id }, // id é ObjectId no Mongo
            data: {
                participantes: conversa.participantes,
                atualizado_em: new Date()
            }
        })
        return atualizado
    } catch (error) {
        console.error("Erro ao atualizar conversa:", error)
        return false
    }
}

// Deletar conversa
async function deleteConversa(id) {
    try {
        await prisma.conversas.delete({ where: { id } })
        return true
    } catch (error) {
        console.error("Erro ao deletar conversa:", error)
        return false
    }
}

// Buscar todas as conversas
async function selectAllConversas() {
    try {
        return await prisma.conversas.findMany({ orderBy: { atualizado_em: 'desc' } })
    } catch (error) {
        console.error("Erro ao buscar conversas:", error)
        return false
    }
}

// Buscar conversa por ID
async function selectByIdConversa(id) {
    try {
        return await prisma.conversas.findUnique({ where: { id } })
    } catch (error) {
        console.error("Erro ao buscar conversa por ID:", error)
        return false
    }
}

module.exports = {
    insertConversa,
    updateConversa,
    deleteConversa,
    selectAllConversas,
    selectByIdConversa
}
