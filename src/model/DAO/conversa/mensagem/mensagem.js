const { PrismaClient } = require('../../../../../prisma/generated/client')
const prismaMySQL = new PrismaClient()

async function insertMensagem(dados) {
    try {
        return await prismaMySQL.tbl_mensagem.create({
            data: {
                descricao: dados.descricao,
                visto: dados.visto === undefined ? false : dados.visto,
                id_conversa: dados.id_conversa,
                id_pessoa: dados.id_pessoa
            }
        })
    } catch (error) {
        console.error('Erro ao inserir mensagem:', error)
        return false
    }
}

async function updateMensagem(dados) {
    try {
        const updated = await prismaMySQL.tbl_mensagem.update({
            where: { id: dados.id },
            data: {
                descricao: dados.descricao || undefined,
                visto: dados.visto === undefined ? undefined : dados.visto
            }
        })
        return updated
    } catch (error) {
        console.error('Erro ao atualizar mensagem:', error)
        return false
    }
}

async function deleteMensagem(id) {
    try {
        await prismaMySQL.tbl_mensagem.delete({ where: { id: id } })
        return true
    } catch (error) {
        console.error('Erro ao deletar mensagem:', error)
        return false
    }
}

async function selectByConversa(id_conversa) {
    try {
        return await prismaMySQL.tbl_mensagem.findMany({ where: { id_conversa: id_conversa }, orderBy: { criado_em: 'desc' } })
    } catch (error) {
        console.error('Erro ao buscar mensagens por conversa:', error)
        return false
    }
}

async function selectByIdMensagem(id) {
    try {
        return await prismaMySQL.tbl_mensagem.findUnique({ where: { id: id } })
    } catch (error) {
        console.error('Erro ao buscar mensagem por id:', error)
        return false
    }
}

module.exports = {
    insertMensagem,
    updateMensagem,
    deleteMensagem,
    selectByConversa,
    selectByIdMensagem
}
