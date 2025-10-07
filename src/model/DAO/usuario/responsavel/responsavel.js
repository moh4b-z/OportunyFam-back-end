const { PrismaClient } = require('../../../../../prisma/generated/mysql')
const prismaMySQL = new PrismaClient()

async function insertResponsavel(responsavel){
    try {
        return await prismaMySQL.tbl_responsavel.create({
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

async function deleteResponsavel(id){
    try {
        await prismaMySQL.tbl_responsavel.delete({ where: { id: id } })
        return true
    } catch (error) {
        console.error("Erro ao deletar relação responsável-criança:", error)
        return false
    }
}

async function selectAllResponsaveis(){
    try {
        return await prismaMySQL.tbl_responsavel.findMany({
            orderBy: { id: 'desc' }
        })
    } catch (error) {
        console.error("Erro ao buscar todas as relações de responsáveis:", error)
        return false
    }
}

async function selectByIdResponsavel(id){
    try {
        return await prismaMySQL.tbl_responsavel.findUnique({
            where: { id: id }
        })
    } catch (error) {
        console.error("Erro ao buscar relação responsável-criança por ID:", error)
        return false
    }
}

async function selectByUsuarioECrianca(id_usuario, id_crianca){
    try {
        return await prismaMySQL.tbl_responsavel.findFirst({
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