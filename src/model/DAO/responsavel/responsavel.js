const { PrismaClient: MySQLClient } = require('../../../generated/mysql')
const prismaMySQL = new MySQLClient()

const insertResponsavel = async (responsavel) => {
    try {
        return await prismaMySQL.responsavel.create({
            data: {
                id_usuario: responsavel.id_usuario,
                id_crianca: responsavel.id_crianca
            }
        })
    } catch (error) {
        console.error("Erro ao inserir relação responsável-criança:", error)
        return false
    }
}

const deleteResponsavel = async (id) => {
    try {
        await prismaMySQL.responsavel.delete({ where: { id: id } })
        return true
    } catch (error) {
        console.error("Erro ao deletar relação responsável-criança:", error)
        return false
    }
}

const selectAllResponsaveis = async () => {
    try {
        return await prismaMySQL.responsavel.findMany({
            orderBy: { id: 'desc' }
        })
    } catch (error) {
        console.error("Erro ao buscar todas as relações de responsáveis:", error)
        return false
    }
}

const selectByIdResponsavel = async (id) => {
    try {
        return await prismaMySQL.responsavel.findUnique({
            where: { id: id }
        })
    } catch (error) {
        console.error("Erro ao buscar relação responsável-criança por ID:", error)
        return false
    }
}

const selectByUsuarioECrianca = async (id_usuario, id_crianca) => {
    try {
        return await prismaMySQL.responsavel.findFirst({
            where: {
                id_usuario: id_usuario,
                id_crianca: id_crianca
            }
        })
    } catch (error) {
        console.error("Erro ao buscar relação por usuário e criança:", error)
        return false
    }
}

module.exports = {
    insertResponsavel,
    deleteResponsavel,
    selectAllResponsaveis,
    selectByIdResponsavel,
    selectByUsuarioECrianca
}