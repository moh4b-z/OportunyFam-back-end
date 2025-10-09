const { PrismaClient } = require('../../../../prisma/generated/mysql')
const prismaMySQL = new PrismaClient()

async function  insertCrianca(crianca){
    try {
        return await prismaMySQL.tbl_crianca.create({
            data: {
                nome: crianca.nome,
                email: crianca.email,
                cpf: crianca.cpf,
                senha: crianca.senha,
                data_nascimento: new Date(crianca.data_nascimento),
                id_sexo: crianca.id_sexo
            }
        })
    } catch (error) {
        console.error("Erro ao inserir criança:", error)
        return false
    }
}

async function  updateCrianca(crianca){
    try {
        return await prismaMySQL.tbl_crianca.update({
            where: { id: crianca.id },
            data: {
                nome: crianca.nome,
                email: crianca.email,
                cpf: crianca.cpf,
                senha: crianca.senha,
                data_nascimento: new Date(crianca.data_nascimento),
                id_sexo: crianca.id_sexo
            }
        })
    } catch (error) {
        console.error("Erro ao atualizar criança:", error)
        return false
    }
}

async function  deleteCrianca(id){
    try {
        await prismaMySQL.tbl_crianca.delete({ where: { id: id } })
        return true
    } catch (error) {
        console.error("Erro ao deletar criança:", error)
        return false
    }
}

async function  selectAllCriancas(){
    try {
        return await prismaMySQL.tbl_crianca.findMany({
            orderBy: { id: 'desc' }
        })
    } catch (error) {
        console.error("Erro ao buscar todas as crianças:", error)
        return false
    }
}

async function  selectByIdCrianca(id){
    try {
        return await prismaMySQL.tbl_crianca.findUnique({
            where: { id: id }
        })
    } catch (error) {
        console.error("Erro ao buscar criança por ID:", error)
        return false
    }
}

async function  selectByEmail(email){
    try {
        return await prismaMySQL.tbl_crianca.findUnique({
            where: { email: email }
        })
    } catch (error) {
        console.error("Erro ao buscar criança por e-mail:", error)
        return false
    }
}

module.exports = {
    insertCrianca,
    updateCrianca,
    deleteCrianca,
    selectAllCriancas,
    selectByIdCrianca,
    selectByEmail
}