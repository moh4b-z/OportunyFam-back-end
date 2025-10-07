const { PrismaClient } = require('../../../../../prisma/generated/mysql')
const prismaMySQL = new PrismaClient()

async function insertTipoNivel(tipoNivel){
    try {
        return await prismaMySQL.tbl_tipo_nivel.create({ data: { nivel: tipoNivel.nivel } })
    } catch (error) {
        console.error("Erro ao inserir tipo de nível:", error)
        return false
    }
}

async function updateTipoNivel(tipoNivel){
    try {
        return await prismaMySQL.tbl_tipo_nivel.update({
            where: { id: tipoNivel.id },
            data: { nivel: tipoNivel.nivel }
        })
    } catch (error) {
        console.error("Erro ao atualizar tipo de nível:", error)
        return false
    }
}

async function deleteTipoNivel(id){
    try {
        await prismaMySQL.tbl_tipo_nivel.delete({ where: { id: id } })
        return true
    } catch (error) {
        console.error("Erro ao deletar tipo de nível:", error)
        return false
    }
}

async function selectAllTipoNivel(){
    try {
        return await prismaMySQL.tbl_tipo_nivel.findMany({ orderBy: { nivel: 'asc' } })
    } catch (error) {
        console.error("Erro ao buscar tipos de nível:", error)
        return false
    }
}

async function selectByIdTipoNivel(id){
    try {
        return await prismaMySQL.tbl_tipo_nivel.findUnique({ where: { id: id } })
    } catch (error) {
        console.error("Erro ao buscar tipo de nível por ID:", error)
        return false
    }
}

module.exports = {
    insertTipoNivel,
    updateTipoNivel,
    deleteTipoNivel,
    selectAllTipoNivel,
    selectByIdTipoNivel
}