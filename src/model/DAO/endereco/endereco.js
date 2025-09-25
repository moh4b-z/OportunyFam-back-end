// src/model/DAO/endereco/endereco.js
const { PrismaClient: MySQLClient } = require('../../../generated/mysql')
const prismaMySQL = new MySQLClient()

const insertEndereco = async (endereco) => {
    try {
        return await prismaMySQL.endereco.create({
            data: {
                cep: endereco.cep,
                logradouro: endereco.logradouro,
                numero: endereco.numero,
                complemento: endereco.complemento,
                bairro: endereco.bairro,
                cidade: endereco.cidade,
                estado: endereco.estado
            }
        })
    } catch (error) {
        console.error("Erro ao inserir endereço:", error)
        return false
    }
}

const updateEndereco = async (endereco) => {
    try {
        return await prismaMySQL.endereco.update({
            where: { id: endereco.id },
            data: {
                cep: endereco.cep,
                logradouro: endereco.logradouro,
                numero: endereco.numero,
                complemento: endereco.complemento,
                bairro: endereco.bairro,
                cidade: endereco.cidade,
                estado: endereco.estado
            }
        })
    } catch (error) {
        console.error("Erro ao atualizar endereço:", error)
        return false
    }
}

const deleteEndereco = async (id) => {
    try {
        await prismaMySQL.endereco.delete({ where: { id: id } })
        return true
    } catch (error) {
        console.error("Erro ao deletar endereço:", error)
        return false
    }
}

const selectAllEnderecos = async () => {
    try {
        return await prismaMySQL.endereco.findMany({ orderBy: { id: 'desc' } })
    } catch (error) {
        console.error("Erro ao buscar endereços:", error)
        return false
    }
}

const selectByIdEndereco = async (id) => {
    try {
        return await prismaMySQL.endereco.findUnique({ where: { id: id } })
    } catch (error) {
        console.error("Erro ao buscar endereço por ID:", error)
        return false
    }
}

module.exports = {
    insertEndereco,
    updateEndereco,
    deleteEndereco,
    selectAllEnderecos,
    selectByIdEndereco
}