const { PrismaClient } = require('../../../../../prisma/generated/client')
const prismaMySQL = new PrismaClient()

async function insertCategoria(categoria){
    try {
        return await prismaMySQL.tbl_categoria.create({
            data: {
                nome: categoria.nome
            }
        })
    } catch (error) {
        console.error("Erro ao inserir categoria:", error)
        return false
    }
}

async function updateCategoria(categoria){
    try {
        return await prismaMySQL.tbl_categoria.update({
            where: { id: categoria.id },
            data: {
                nome: categoria.nome
            }
        })
    } catch (error) {
        console.error("Erro ao atualizar categoria:", error)
        return false
    }
}

async function deleteCategoria(id){
    try {
        // A chave estrangeira com RESTRICT impede a exclusão se houver atividades associadas
        await prismaMySQL.tbl_categoria.delete({ where: { id: id } })
        return true
    } catch (error) {
        console.error("Erro ao deletar categoria:", error)
        return false
    }
}

async function selectAllCategorias(){
    try {
        return await prismaMySQL.tbl_categoria.findMany({ orderBy: { nome: 'asc' } })
    } catch (error) {
        console.error("Erro ao buscar categorias:", error)
        return false
    }
}

async function selectByIdCategoria(id){
    try {
        return await prismaMySQL.tbl_categoria.findUnique({ where: { id: id } })
    } catch (error) {
        console.error("Erro ao buscar categoria por ID:", error)
        return false
    }
}

module.exports = {
    insertCategoria,
    updateCategoria,
    deleteCategoria,
    selectAllCategorias,
    selectByIdCategoria
}