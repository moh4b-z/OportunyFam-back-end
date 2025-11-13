const { PrismaClient } = require('../../../../../prisma/generated/client')
const prismaMySQL = new PrismaClient()

async function insertUsuarioEndereco(dadosRelacao){
    try {
        return await prismaMySQL.tbl_usuario_endereco.create({
            data: {
                tbl_usuario: {
                    connect: { id: dadosRelacao.id_usuario }
                },
                tbl_endereco: {
                    connect: { id: dadosRelacao.id_endereco }
                },
                descricao: dadosRelacao.descricao || null
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
                tbl_usuario: {
                    id: id_usuario
                }
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