const { PrismaClient: MySQLClient } = require('../../../generated/mysql')
const prismaMySQL = new MySQLClient()

async function insertInstituicao(instituicao){
    try {
        return await prismaMySQL.tbl_instituicao.create({
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

async function updateInstituicao(instituicao){
    try {
        return await prismaMySQL.tbl_instituicao.update({
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

async function deleteInstituicao(id){
    try {
        await prismaMySQL.tbl_instituicao.delete({ where: { id: id } })
        return true
    } catch (error) {
        console.error("Erro ao deletar instituição:", error)
        return false
    }
}

async function selectAllInstituicoes(){
    try {
        return await prismaMySQL.$queryRaw`SELECT * FROM vw_instituicao_completa ORDER BY id DESC`
    } catch (error) {
        console.error("Erro ao buscar todas as instituições:", error)
        return false
    }
}

async function selectByIdInstituicao(id){
    try {
        const result = await prismaMySQL.$queryRaw`SELECT * FROM vw_instituicao_completa WHERE id = ${id}`
        return result.length > 0 ? result[0] : null
    } catch (error) {
        console.error("Erro ao buscar instituição por ID:", error)
        return false
    }
}

async function selectByEmail(email){
    try {
        return await prismaMySQL.tbl_instituicao.findUnique({ where: { email: email } })
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