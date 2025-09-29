const { PrismaClient: MySQLClient } = require('../../../generated/mysql')
const prismaMySQL = new MySQLClient()

const insertCrianca = async (crianca) => {
    try {
        return await prismaMySQL.crianca.create({
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

const updateCrianca = async (crianca) => {
    try {
        return await prismaMySQL.crianca.update({
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

const deleteCrianca = async (id) => {
    try {
        await prismaMySQL.crianca.delete({ where: { id: id } })
        return true
    } catch (error) {
        console.error("Erro ao deletar criança:", error)
        return false
    }
}

const selectAllCriancas = async () => {
    try {
        return await prismaMySQL.crianca.findMany({
            orderBy: { id: 'desc' }
        })
    } catch (error) {
        console.error("Erro ao buscar todas as crianças:", error)
        return false
    }
}

const selectByIdCrianca = async (id) => {
    try {
        return await prismaMySQL.crianca.findUnique({
            where: { id: id }
        })
    } catch (error) {
        console.error("Erro ao buscar criança por ID:", error)
        return false
    }
}

const selectByEmail = async (email) => {
    try {
        return await prismaMySQL.crianca.findUnique({
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