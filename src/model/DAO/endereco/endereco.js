const { PrismaClient } = require('@prisma/client')
const prismaMySQL = PrismaClient

async function insertEndereco(endereco){
    try {
        return await prismaMySQL.tbl_endereco.create({
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

async function updateEndereco(endereco){
    try {
        return await prismaMySQL.tbl_endereco.update({
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

async function deleteEndereco(id){
    try {
        await prismaMySQL.tbl_endereco.delete({ where: { id: id } })
        return true
    } catch (error) {
        console.error("Erro ao deletar endereço:", error)
        return false
    }
}

async function selectAllEnderecos(){
    try {
        return await prismaMySQL.tbl_endereco.findMany({ orderBy: { id: 'desc' } })
    } catch (error) {
        console.error("Erro ao buscar endereços:", error)
        return false
    }
}

async function selectByIdEndereco(id){
    try {
        return await prismaMySQL.tbl_endereco.findUnique({ where: { id: id } })
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