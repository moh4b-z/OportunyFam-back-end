
const { PrismaClient: MySQLClient } = require('../../../generated/mysql')
const prismaMySQL = new MySQLClient()

const insertUsuarioEndereco = async (dadosRelacao) => {
    try {
        return await prismaMySQL.usuarioEndereco.create({
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

const deleteUsuarioEnderecoByUsuario = async (id_usuario) => {
    try {
        await prismaMySQL.usuarioEndereco.deleteMany({
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