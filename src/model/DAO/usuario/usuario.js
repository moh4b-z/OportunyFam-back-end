const { PrismaClient } = require('../../../../prisma/generated/mysql')
const { selectByIdCrianca } = require('../crianca/crianca')
const { selectByIdInstituicao } = require('../instituicao/instituicao')
const prismaMySQL = new PrismaClient()

async function insertUsuario(usuario){
    try {
        //console.log(usuario);
        
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


module.exports = {
    insertUsuario,
    updateUsuario,
    deleteUsuario,
    selectAllUsuario,
    selectByIdUsuario
}