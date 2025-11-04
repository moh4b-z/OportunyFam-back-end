const { PrismaClient } = require('@prisma/client')
const prismaMySQL = new PrismaClient()


const encryptionFunction = require('../../utils/encryptionFunction')

async function login(email, senhaPlain) {
    try {
        // 1) Busca a pessoa pelo email
        const pessoa = await prismaMySQL.tbl_pessoa.findUnique({ where: { email } })

        if (!pessoa) {
            // não encontrou email
            return 404
        }

        const storedSenha = pessoa.senha

        // 2) Verifica a senha usando verifyPassword
        try {
            const senhaOk = storedSenha && encryptionFunction.verifyPassword(senhaPlain, storedSenha)
            if (!senhaOk) {
                return 401
            }
        } catch (errVerify) {
            // Em caso de formato inesperado de senha armazenada, faça comparação direta (fallback)
            if (storedSenha !== senhaPlain) {
                return 401
            }
        }

        // 3) Determina o tipo de usuário e retorna os dados completos das views
        // Verifica se é usuario
        const usuarioRow = await prismaMySQL.$queryRawUnsafe(
            `SELECT * FROM vw_usuario_completa WHERE pessoa_id = ? LIMIT 1`,
            pessoa.id
        )
        if (usuarioRow && usuarioRow[0]) {
            // Quando o Prisma retorna um array, o primeiro elemento pode ser o conjunto de linhas
            const rows = Array.isArray(usuarioRow[0]) ? usuarioRow[0] : usuarioRow
            if (rows.length > 0) {
                return { tipo: 'usuario', usuario: rows[0] }
            }
        }

        // Verifica instituicao
        const instituicaoRow = await prismaMySQL.$queryRawUnsafe(
            `SELECT * FROM vw_instituicao_completa WHERE pessoa_id = ? LIMIT 1`,
            pessoa.id
        )
        if (instituicaoRow && instituicaoRow[0]) {
            const rows = Array.isArray(instituicaoRow[0]) ? instituicaoRow[0] : instituicaoRow
            if (rows.length > 0) {
                return { tipo: 'instituicao', usuario: rows[0] }
            }
        }

        // Verifica crianca
        const criancaRow = await prismaMySQL.$queryRawUnsafe(
            `SELECT * FROM vw_crianca_completa WHERE pessoa_id = ? LIMIT 1`,
            pessoa.id
        )
        if (criancaRow && criancaRow[0]) {
            const rows = Array.isArray(criancaRow[0]) ? criancaRow[0] : criancaRow
            if (rows.length > 0) {
                return { tipo: 'crianca', usuario: rows[0] }
            }
        }

        // Se chegou aqui, algo inesperado: retornar erro genérico
        return 500
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