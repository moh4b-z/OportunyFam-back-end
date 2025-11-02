const { PrismaClient } = require('../../../prisma/generated/mysql')
const prismaMySQL = new PrismaClient()


async function selectByEmail(email){
    try {
        let result = await prismaMySQL.tbl_usuario.findUnique({
            where: { email: email }
        })
        let senha = result.senha
        if(result){
            result = await selectByIdUsuario(result.id)
        }else{
            result = false
        }
        return {...result, senha: senha}
    } catch (error) {
        console.error("Erro DAO: Erro ao buscar usuário por e-mail.", error)
        return false
    }
}

async function verifyEmailExists(email){
    try {
        let usuario = await prismaMySQL.tbl_usuario.findUnique({ where: { email } })
        
        let result = usuario || crianca || instituicao
        return result
    } catch (error) {
        console.error("Erro DAO: Erro ao verificar e-mail.", error)
        return false
    }
}

module.exports = {
    verifyEmailExists,
    selectByEmail
}