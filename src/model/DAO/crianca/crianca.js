const { PrismaClient } = require('../../../../prisma/generated/mysql')
const prismaMySQL = new PrismaClient()

async function  insertCrianca(crianca){
    try {
        let result = await prismaMySQL.tbl_crianca.create({
            data: {
                nome: crianca.nome,
                email: crianca.email,
                cpf: crianca.cpf,
                senha: crianca.senha,
                data_nascimento: new Date(crianca.data_nascimento),
                id_sexo: crianca.id_sexo
            }
        })
        result = await selectByIdCrianca(result.id)
        return result
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
        let result = await prismaMySQL.$queryRaw`SELECT * FROM vw_crianca_completa ORDER BY id DESC`
        return result
    } catch (error) {
        console.error("Erro ao buscar todas as crianças:", error)
        return false
    }
}

async function  selectByIdCrianca(id){
    try {
        let result = await prismaMySQL.$queryRaw`SELECT * FROM vw_crianca_completa WHERE id = ${id}`
        return result.length > 0 ? result[0] : null
    } catch (error) {
        console.error("Erro ao buscar criança por ID:", error)
        return false
    }
}


module.exports = {
    insertCrianca,
    updateCrianca,
    deleteCrianca,
    selectAllCriancas,
    selectByIdCrianca
}