const { PrismaClient } = require('@prisma/client')
const prismaMySQL = new PrismaClient()

async function insertPessoaConversa(dados) {
    try {
        return await prismaMySQL.tbl_pessoa_conversa.create({ data: { id_pessoa: dados.id_pessoa, id_conversa: dados.id_conversa } })
    } catch (error) {
        console.error('Erro ao inserir pessoa_conversa:', error)
        return false
    }
}

async function deleteByConversaId(id_conversa) {
    try {
        await prismaMySQL.tbl_pessoa_conversa.deleteMany({ where: { id_conversa: id_conversa } })
        return true
    } catch (error) {
        console.error('Erro ao deletar pessoa_conversa por conversa:', error)
        return false
    }
}

async function selectByConversa(id_conversa) {
    try {
        return await prismaMySQL.tbl_pessoa_conversa.findMany({ where: { id_conversa: id_conversa } })
    } catch (error) {
        console.error('Erro ao buscar pessoa_conversa por conversa:', error)
        return false
    }
}

async function selectByPessoa(id_pessoa) {
    try {
        return await prismaMySQL.tbl_pessoa_conversa.findMany({ where: { id_pessoa: id_pessoa } })
    } catch (error) {
        console.error('Erro ao buscar pessoa_conversa por pessoa:', error)
        return false
    }
}

module.exports = {
    insertPessoaConversa,
    deleteByConversaId,
    selectByConversa,
    selectByPessoa
}
