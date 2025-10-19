const { PrismaClient } = require('../../../../prisma/generated/mysql')
const { selectByIdCrianca } = require('../crianca/crianca')
const { selectByIdInstituicao } = require('../instituicao/instituicao')
const prismaMySQL = new PrismaClient()

async function insertUsuario(usuario){
    try {
        let result = await prismaMySQL.tbl_usuario.create({
            data: {
                nome: usuario.nome,
                foto_perfil: usuario.foto_perfil,
                email: usuario.email,
                senha: usuario.senha,
                data_nascimento: new Date(usuario.data_nascimento),
                cpf: usuario.cpf,
                id_sexo: usuario.id_sexo,
                id_tipo_nivel: usuario.id_tipo_nivel
            }
        })

        result = await selectByIdUsuario(result.id)
        return result
    } catch (error) {
        console.error("Erro DAO: Erro ao inserir usuário.", error)
        return false
    }
}

async function updateUsuario(usuario){
    try {
        let result = await prismaMySQL.tbl_usuario.update({
            where: { id: usuario.id },
            data: {
                nome: usuario.nome,
                foto_perfil: usuario.foto_perfil,
                email: usuario.email,
                senha: usuario.senha,
                data_nascimento: new Date(usuario.data_nascimento),
                cpf: usuario.cpf,
                id_sexo: usuario.id_sexo,
                id_tipo_nivel: usuario.id_tipo_nivel
            }
        })
        return result
    } catch (error) {
        console.error("Erro DAO: Erro ao atualizar usuário.", error)
        return false
    }
}


async function deleteUsuario(id){
    try {
        let result = await prismaMySQL.tbl_usuario.delete({ where: { id: id } })
        return result ? true : false
    } catch (error) {
        console.error("Erro DAO: Erro ao deletar usuário.", error)
        return false
    }
}


async function selectAllUsuario(){
    try {
        let result = await prismaMySQL.$queryRaw`SELECT * FROM vw_detalhes_usuario ORDER BY id DESC`
        return result
    } catch (error) {
        console.error("Erro DAO: Erro ao buscar todos os usuários.", error)
        return false
    }
}

async function selectByIdUsuario(id){
    try {
        let result = await prismaMySQL.$queryRaw`SELECT * FROM vw_detalhes_usuario WHERE id = ${id}`
        return result.length > 0 ? result[0] : null
    } catch (error) {
        console.error("Erro DAO: Erro ao buscar usuário por ID.", error)
        return false
    }
}


async function selectByEmail(email){
    try {
        let result = await prismaMySQL.tbl_usuario.findUnique({
            where: { email: email }
        })
        result = await selectByIdUsuario(result.id)
        return result
    } catch (error) {
        console.error("Erro DAO: Erro ao buscar usuário por e-mail.", error)
        return false
    }
}

// Verifica se um e-mail já existe nas tabelas (usuario, crianca, instituicao).
async function verifyEmailExists(email){
    try {
        let usuario = await prismaMySQL.tbl_usuario.findUnique({ where: { email } })
        let crianca = await prismaMySQL.tbl_crianca.findUnique({ where: { email } })
        let instituicao = await prismaMySQL.tbl_instituicao.findUnique({ where: { email } })
        
        let result = usuario || crianca || instituicao
        return result
    } catch (error) {
        console.error("Erro DAO: Erro ao verificar e-mail.", error)
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