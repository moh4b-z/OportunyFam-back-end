const { PrismaClient: MySQLClient } = require('../../../generated/mysql')
const prismaMySQL = new MySQLClient()

async function insertSexo(sexo) {
    try {
        return await prismaMySQL.sexo.create({ data: { nome: sexo.nome } })
    } catch (error) {
        console.error("Erro ao inserir sexo:", error)
        return false
    }
}

async function updateSexo(sexo) {
    try {
        return await prismaMySQL.sexo.update({
            where: { id: sexo.id },
            data: { nome: sexo.nome }
        })
    } catch (error) {
        console.error("Erro ao atualizar sexo:", error)
        return false
    }
}

async function deleteSexo(id) {
    try {
        await prismaMySQL.sexo.delete({ where: { id: id } })
        return true
    } catch (error) {
        console.error("Erro ao deletar sexo:", error)
        return false
    }
}

async function selectAllSexo() {
    try {
        // Ordena por nome para uma lista mais organizada
        return await prismaMySQL.sexo.findMany({ orderBy: { nome: 'asc' } }) 
    } catch (error) {
        console.error("Erro ao buscar sexos:", error)
        return false
    }
}

async function selectByIdSexo(id) {
    try {
        return await prismaMySQL.sexo.findUnique({ where: { id: id } })
    } catch (error) {
        console.error("Erro ao buscar sexo por ID:", error)
        return false
    }
}

module.exports = {
    insertSexo,
    updateSexo,
    deleteSexo,
    selectAllSexo,
    selectByIdSexo
}