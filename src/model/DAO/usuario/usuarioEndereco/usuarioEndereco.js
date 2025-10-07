const { PrismaClient } = require('@prisma/client')
const prismaMySQL = PrismaClient

async function insertUsuarioEndereco(dadosRelacao){
    try {
        return await prismaMySQL.tbl_usuario_endereco.create({
            data: {
                id_usuario: dadosRelacao.id_usuario,
                id_endereco: dadosRelacao.id_endereco
            }
        })
    } catch (error) {
        console.error("Erro ao inserir relação usuário-endereço:", error)
        return false
    }
}

async function deleteUsuarioEnderecoByUsuario(id_usuario){
    try {
        await prismaMySQL.tbl_usuario_endereco.deleteMany({
            where: {
                id_usuario: id_usuario
            }
        })
        return true
    } catch (error) {
        console.error("Erro ao deletar relação usuário-endereço:", error)
        return false
    }
}

module.exports = {
    insertUsuarioEndereco,
    deleteUsuarioEnderecoByUsuario
}