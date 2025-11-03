const { PrismaClient } = require('../../../prisma/generated/mysql')
const prismaMySQL = new PrismaClient()


async function login(email, senha) {
    try {
        // Executa a procedure sp_login passando os parâmetros
        const result = await prismaMySQL.$queryRawUnsafe(
            `CALL sp_login(?, ?)`,
            email,
            senha
        )

        // O MySQL retorna um array de arrays quando chama uma procedure
        let dados = result[0] || []

        // Se vier vazio, significa que houve erro (404, 401 ou 500)
        if (dados.length === 0) {
            console.log("Nenhum resultado retornado da procedure.")
            return false
        }
        let usuario = dados[0]

        // Verifica se veio algum status de erro
        if (usuario.status === 404) {
            return 404
        } else if (usuario.status === 401) {
            return 401
        } else if (usuario.status === 500) {
            return 500
        }
        let tipoUsuario = null
        if (usuario.usuario_id) {
            tipoUsuario = "usuario"
        } else if (usuario.instituicao_id) {
            tipoUsuario = "instituicao"
        } else if (usuario.crianca_id) {
            tipoUsuario = "crianca"
        }
        return {
            tipo: tipoUsuario,
            usuario: usuario
        }

    } catch (error) {
        console.error("Erro DAO: Erro ao executar login.", error)
        return { status: 500, message: "Erro interno no servidor" }
    }
}


async function verifyEmailExists(email){
    try {
        let pessoa = await prismaMySQL.tbl_pessoa.findUnique({ where: { email } })
        
        let result = pessoa ? true : false
        return result
    } catch (error) {
        console.error("Erro DAO: Erro ao verificar e-mail.", error)
        return false
    }
}
async function verifyCPFExists(cpf, ignorePessoaId = null){
    try {
        const where = { cpf }
        // Se forneceu um ID para ignorar, adiciona condição NOT
        if (ignorePessoaId) {
            where.NOT = { id: ignorePessoaId }
        }
        
        let pessoa = await prismaMySQL.tbl_pessoa.findFirst({ where })
        return pessoa ? true : false
    } catch (error) {
        console.error("Erro DAO: Erro ao verificar CPF.", error)
        return false
    }
}
async function verifyCNPJExists(cnpj){
    try {
        let pessoa = await prismaMySQL.tbl_instituicao.findUnique({ where: { cnpj } })
        
        let result = pessoa ? true : false
        return result
    } catch (error) {
        console.error("Erro DAO: Erro ao verificar CNPJ.", error)
        return false
    }
}

module.exports = {
    verifyEmailExists,
    verifyCPFExists,
    verifyCNPJExists,
    login
}