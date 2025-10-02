const { PrismaClient: MySQLClient } = require('../../../generated/mysql')
const prismaMySQL = new MySQLClient()

async function insertUsuario(usuario){
    try {
        return await prismaMySQL.usuario.create({
            data: {
                nome: usuario.nome,
                email: usuario.email,
                senha: usuario.senha,
                data_nascimento: new Date(usuario.data_nascimento),
                cpf: usuario.cpf,
                id_sexo: usuario.id_sexo,
                id_tipo_nivel: usuario.id_tipo_nivel
            }
        })
    } catch (error) {
        console.error("Erro ao inserir usuário:", error)
        return false
    }
}

async function updateUsuario(usuario){
    try {
        return await prismaMySQL.usuario.update({
            where: { id: usuario.id },
            data: {
                nome: usuario.nome,
                email: usuario.email,
                senha: usuario.senha,
                data_nascimento: new Date(usuario.data_nascimento),
                cpf: usuario.cpf,
                id_sexo: usuario.id_sexo,
                id_tipo_nivel: usuario.id_tipo_nivel
            }
        })
    } catch (error) {
        console.error("Erro ao atualizar usuário:", error)
        return false
    }
}

async function deleteUsuario(id){
    try {
        await prismaMySQL.usuario.delete({ where: { id: id } })
        return true
    } catch (error) {
        console.error("Erro ao deletar usuário:", error)
        return false
    }
}

async function selectAllUsuario(){
    try {
        // Usa a view para buscar dados completos do usuário
        return await prismaMySQL.$queryRaw`SELECT * FROM vw_detalhes_usuario ORDER BY id DESC`
    } catch (error) {
        console.error("Erro ao buscar todos os usuários:", error)
        return false
    }
}

async function selectByIdUsuario(id){
    try {
        // Usa a view para buscar um usuário específico
        const result = await prismaMySQL.$queryRaw`SELECT * FROM vw_detalhes_usuario WHERE id = ${id}`
        return result.length > 0 ? result[0] : null
    } catch (error) {
        console.error("Erro ao buscar usuário por ID:", error)
        return false
    }
}

async function selectByEmail(email){
    try {
        // Busca um usuário pelo e-mail para o login
        const result = await prismaMySQL.usuario.findUnique({
            where: { email: email }
        })
        return result
    } catch (error) {
        console.error("Erro ao buscar usuário por e-mail:", error)
        return false
    }
}

async function verifyEmailExists(email){h
    try {
        const usuario = await prismaMySQL.usuario.findUnique({ where: { email } })
        const crianca = await prismaMySQL.crianca.findUnique({ where: { email } })
        const instituicao = await prismaMySQL.instituicao.findUnique({ where: { email } })
        return usuario || crianca || instituicao
    } catch (error) {
        console.error("Erro ao verificar e-mail:", error)
        return false
    }
}

module.exports = {
    insertUsuario,
    updateUsuario,
    deleteUsuario,
    selectAllUsuario,
    selectByIdUsuario,
    selectByEmail,
    verifyEmailExists
}