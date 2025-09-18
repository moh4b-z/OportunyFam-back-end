const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

// Inserir notificação
async function insertNotificacao(notificacao) {
    try {
        const nova = await prisma.notificacoes.create({
            data: {
                usuario_id: notificacao.usuario_id,
                mensagem: notificacao.mensagem,
                lida: notificacao.lida || false,
                criada_em: new Date()
            }
        })
        return nova
    } catch (error) {
        console.error("Erro ao inserir notificacao:", error)
        return false
    }
}

// Atualizar notificação
async function updateNotificacao(notificacao) {
    try {
        const atualizado = await prisma.notificacoes.update({
            where: { id: notificacao.id },
            data: {
                mensagem: notificacao.mensagem,
                lida: notificacao.lida
            }
        })
        return atualizado
    } catch (error) {
        console.error("Erro ao atualizar notificacao:", error)
        return false
    }
}

// Deletar notificação
async function deleteNotificacao(id) {
    try {
        await prisma.notificacoes.delete({ where: { id } })
        return true
    } catch (error) {
        console.error("Erro ao deletar notificacao:", error)
        return false
    }
}

// Buscar todas as notificações
async function selectAllNotificacoes() {
    try {
        return await prisma.notificacoes.findMany({ orderBy: { criada_em: 'desc' } })
    } catch (error) {
        console.error("Erro ao buscar notificacoes:", error)
        return false
    }
}

// Buscar notificações por usuário
async function selectByUsuarioId(usuarioId) {
    try {
        return await prisma.notificacoes.findMany({
            where: { usuario_id: usuarioId },
            orderBy: { criada_em: 'desc' }
        })
    } catch (error) {
        console.error("Erro ao buscar notificacoes por usuario:", error)
        return false
    }
}

module.exports = {
    insertNotificacao,
    updateNotificacao,
    deleteNotificacao,
    selectAllNotificacoes,
    selectByUsuarioId
}
