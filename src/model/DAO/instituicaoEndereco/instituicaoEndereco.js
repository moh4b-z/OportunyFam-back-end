const { PrismaClient: MySQLClient } = require('../../../generated/mysql')
const prismaMySQL = new MySQLClient()


const insertInstituicaoEndereco = async (dadosRelacao) => {
    try {
        return await prismaMySQL.instituicaoEndereco.create({
            data: {
                id_instituicao: dadosRelacao.id_instituicao,
                id_endereco: dadosRelacao.id_endereco
            }
        })
    } catch (error) {
        console.error("Erro ao inserir relação instituição-endereço:", error)
        return false
    }
}

const deleteInstituicaoEnderecoByInstituicao = async (id_instituicao) => {
    try {
        await prismaMySQL.instituicaoEndereco.deleteMany({
            where: {
                id_instituicao: id_instituicao
            }
        })
        return true
    } catch (error) {
        console.error("Erro ao deletar relação instituição-endereço:", error)
        return false
    }
}

module.exports = {
    insertInstituicaoEndereco,
    deleteInstituicaoEnderecoByInstituicao
}