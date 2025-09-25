const { PrismaClient: MySQLClient } = require('../../../generated/mysql')
const prismaMySQL = new MySQLClient()

/**
 * @description Insere uma nova relação na tabela tbl_instituicao_endereco.
 * @param {object} dadosRelacao - Objeto com id_instituicao e id_endereco.
 * @returns {Promise<boolean>} Retorna o objeto da relação criada ou false em caso de erro.
 */
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

/**
 * @description Deleta todas as relações de endereço para uma instituição específica.
 * @param {number} id_instituicao - O ID da instituição.
 * @returns {Promise<boolean>} Retorna true se a operação for bem-sucedida ou false em caso de erro.
 */
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