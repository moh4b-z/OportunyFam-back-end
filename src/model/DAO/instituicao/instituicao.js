const { PrismaClient: MySQLClient } = require('../../../generated/mysql')
const prismaMySQL = new MySQLClient()

const insertInstituicao = async (instituicao) => {
    try {
        return await prismaMySQL.instituicao.create({
            data: {
                nome: instituicao.nome,
                cnpj: instituicao.cnpj,
                email: instituicao.email,
                senha: instituicao.senha,
                descricao: instituicao.descricao
            }
        })
    } catch (error) {
        console.error("Erro ao inserir instituição:", error)
        return false
    }
}

const updateInstituicao = async (instituicao) => {
    try {
        return await prismaMySQL.instituicao.update({
            where: { id: instituicao.id },
            data: {
                nome: instituicao.nome,
                cnpj: instituicao.cnpj,
                email: instituicao.email,
                senha: instituicao.senha,
                descricao: instituicao.descricao
            }
        })
    } catch (error) {
        console.error("Erro ao atualizar instituição:", error)
        return false
    }
}

const deleteInstituicao = async (id) => {
    try {
        await prismaMySQL.instituicao.delete({ where: { id: id } })
        return true
    } catch (error) {
        console.error("Erro ao deletar instituição:", error)
        return false
    }
}

const selectAllInstituicoes = async () => {
    try {
        return await prismaMySQL.$queryRaw`SELECT * FROM vw_instituicao_completa ORDER BY id DESC`
    } catch (error) {
        console.error("Erro ao buscar todas as instituições:", error)
        return false
    }
}

const selectByIdInstituicao = async (id) => {
    try {
        const result = await prismaMySQL.$queryRaw`SELECT * FROM vw_instituicao_completa WHERE id = ${id}`
        return result.length > 0 ? result[0] : null
    } catch (error) {
        console.error("Erro ao buscar instituição por ID:", error)
        return false
    }
}

const selectByEmail = async (email) => {
    try {
        return await prismaMySQL.instituicao.findUnique({ where: { email: email } })
    } catch (error) {
        console.error("Erro ao buscar instituição por e-mail:", error)
        return false
    }
}

module.exports = {
    insertInstituicao,
    updateInstituicao,
    deleteInstituicao,
    selectAllInstituicoes,
    selectByIdInstituicao,
    selectByEmail
}