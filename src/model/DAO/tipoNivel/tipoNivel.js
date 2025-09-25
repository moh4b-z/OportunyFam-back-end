const { PrismaClient: MySQLClient } = require('../../../generated/mysql')
const prismaMySQL = new MySQLClient()

const insertTipoNivel = async (tipoNivel) => {
    try {
        return await prismaMySQL.tipoNivel.create({ data: { nivel: tipoNivel.nivel } })
    } catch (error) {
        console.error("Erro ao inserir tipo de nível:", error)
        return false
    }
}

const updateTipoNivel = async (tipoNivel) => {
    try {
        return await prismaMySQL.tipoNivel.update({
            where: { id: tipoNivel.id },
            data: { nivel: tipoNivel.nivel }
        })
    } catch (error) {
        console.error("Erro ao atualizar tipo de nível:", error)
        return false
    }
}

const deleteTipoNivel = async (id) => {
    try {
        await prismaMySQL.tipoNivel.delete({ where: { id: id } })
        return true
    } catch (error) {
        console.error("Erro ao deletar tipo de nível:", error)
        return false
    }
}

const selectAllTipoNivel = async () => {
    try {
        return await prismaMySQL.tipoNivel.findMany({ orderBy: { nivel: 'asc' } })
    } catch (error) {
        console.error("Erro ao buscar tipos de nível:", error)
        return false
    }
}

const selectByIdTipoNivel = async (id) => {
    try {
        return await prismaMySQL.tipoNivel.findUnique({ where: { id: id } })
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