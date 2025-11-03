const { PrismaClient } = require('../../../../../prisma/generated/mysql')
const prismaMySQL = new PrismaClient()

async function insertPublicacaoInstituicao(dados) {
    try {
        return await prismaMySQL.tbl_publicacao_instituicao.create({
            data: {
                descricao: dados.descricao || null,
                foto_perfil: dados.foto_perfil || null,
                id_instituicao: dados.id_instituicao
            }
        })
    } catch (error) {
        console.error('Erro ao inserir publicacao_instituicao:', error)
        return false
    }
}

async function updatePublicacaoInstituicao(dados) {
    try {
        const updated = await prismaMySQL.tbl_publicacao_instituicao.update({
            where: { id: dados.id },
            data: {
                descricao: dados.descricao || null,
                foto_perfil: dados.foto_perfil || null,
                id_instituicao: dados.id_instituicao
            }
        })
        return updated
    } catch (error) {
        console.error('Erro ao atualizar publicacao_instituicao:', error)
        return false
    }
}

async function deletePublicacaoInstituicao(id) {
    try {
        await prismaMySQL.tbl_publicacao_instituicao.delete({ where: { id: id } })
        return true
    } catch (error) {
        console.error('Erro ao deletar publicacao_instituicao:', error)
        return false
    }
}

async function selectAllPublicacoesInstituicao() {
    try {
        return await prismaMySQL.tbl_publicacao_instituicao.findMany({ orderBy: { criado_em: 'desc' } })
    } catch (error) {
        console.error('Erro ao buscar publicacoes_instituicao:', error)
        return false
    }
}

async function selectByIdPublicacaoInstituicao(id) {
    try {
        return await prismaMySQL.tbl_publicacao_instituicao.findUnique({ where: { id: id } })
    } catch (error) {
        console.error('Erro ao buscar publicacao_instituicao por id:', error)
        return false
    }
}

async function selectByInstituicao(id_instituicao) {
    try {
        return await prismaMySQL.tbl_publicacao_instituicao.findMany({ where: { id_instituicao: id_instituicao }, orderBy: { criado_em: 'desc' } })
    } catch (error) {
        console.error('Erro ao buscar publicacoes por instituicao:', error)
        return false
    }
}

module.exports = {
    insertPublicacaoInstituicao,
    updatePublicacaoInstituicao,
    deletePublicacaoInstituicao,
    selectAllPublicacoesInstituicao,
    selectByIdPublicacaoInstituicao,
    selectByInstituicao
}
