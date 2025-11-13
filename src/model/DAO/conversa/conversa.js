const { PrismaClient } = require('../../../../prisma/generated/client')
const prismaMySQL = new PrismaClient()

async function insertConversa() {
    try {
        return await prismaMySQL.tbl_conversa.create({ data: {} })
    } catch (error) {
        console.error('Erro ao inserir conversa:', error)
        return false
    }
}

async function updateConversa(dados) {
    try {
        // No momento não há campos editáveis além de timestamps, mas mantemos a função para compatibilidade
        const updated = await prismaMySQL.tbl_conversa.update({ where: { id: dados.id }, data: {} })
        return updated
    } catch (error) {
        console.error('Erro ao atualizar conversa:', error)
        return false
    }
}

async function deleteConversa(id) {
    try {
        await prismaMySQL.tbl_conversa.delete({ where: { id: id } })
        return true
    } catch (error) {
        console.error('Erro ao deletar conversa:', error)
        return false
    }
}

async function selectAllConversas() {
    try {
        return await prismaMySQL.tbl_conversa.findMany({ orderBy: { criado_em: 'desc' } })
    } catch (error) {
        console.error('Erro ao buscar conversas:', error)
        return false
    }
}

async function selectByIdConversa(id) {
    try {
        return await prismaMySQL.tbl_conversa.findUnique({ where: { id: id } })
    } catch (error) {
        console.error('Erro ao buscar conversa por id:', error)
        return false
    }
}

async function selectConversasPorPessoa(id_pessoa) {
  try {
    let result = await prismaMySQL.$queryRaw`
      SELECT *
      FROM vw_conversas_detalhe
      WHERE id_remetente = ${id_pessoa}
      ORDER BY (ultima_mensagem->>'$.data_envio') DESC;
    `
    //console.log(result);
    
    return result
  } catch (error) {
    console.error("Erro ao buscar conversas do usuário:", error)
    return false
  }
}


module.exports = {
    insertConversa,
    updateConversa,
    deleteConversa,
    selectAllConversas,
    selectByIdConversa,
    selectConversasPorPessoa
}
