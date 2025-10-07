const { PrismaClient } = require('@prisma/client')
const prismaMySQL = PrismaClient

async function insertRedeSocialUsuario(redeSocialUsuario){
    try {
        return await prismaMySQL.tbl_rede_social_usuario.create({
            data: {
                id_usuario: redeSocialUsuario.id_usuario,
                id_rede_social: redeSocialUsuario.id_rede_social,
                link_perfil: redeSocialUsuario.link_perfil,
                link_abreviado: redeSocialUsuario.link_abreviado,
                numero_telefone: redeSocialUsuario.numero_telefone,
                descricao: redeSocialUsuario.descricao
            }
        })
    } catch (error) {
        console.error("Erro ao inserir relação rede social-usuário:", error)
        return false
    }
}

async function updateRedeSocialUsuario(redeSocialUsuario){
    try {
        return await prismaMySQL.tbl_rede_social_usuario.update({
            where: { id: redeSocialUsuario.id },
            data: {
                id_usuario: redeSocialUsuario.id_usuario,
                id_rede_social: redeSocialUsuario.id_rede_social,
                link_perfil: redeSocialUsuario.link_perfil,
                link_abreviado: redeSocialUsuario.link_abreviado,
                numero_telefone: redeSocialUsuario.numero_telefone,
                descricao: redeSocialUsuario.descricao
            }
        })
    } catch (error) {
        console.error("Erro ao atualizar relação rede social-usuário:", error)
        return false
    }
}

async function deleteRedeSocialUsuario(id){
    try {
        await prismaMySQL.tbl_rede_social_usuario.delete({ where: { id: id } })
        return true
    } catch (error) {
        console.error("Erro ao deletar relação rede social-usuário:", error)
        return false
    }
}

async function selectAllRedesSociaisUsuario(){
    try {
        // Você pode criar uma View posteriormente para retornar detalhes do usuário e da rede social
        return await prismaMySQL.tbl_rede_social_usuario.findMany({
            orderBy: { id: 'desc' }
        })
    } catch (error) {
        console.error("Erro ao buscar todas as relações rede social-usuário:", error)
        return false
    }
}

async function selectByIdRedeSocialUsuario(id){
    try {
        return await prismaMySQL.tbl_rede_social_usuario.findUnique({
            where: { id: id }
        })
    } catch (error) {
        console.error("Erro ao buscar relação rede social-usuário por ID:", error)
        return false
    }
}

async function selectByUsuarioAndRedeSocial(id_usuario, id_rede_social){
    try {
        return await prismaMySQL.tbl_rede_social_usuario.findFirst({
            where: {
                id_usuario: id_usuario,
                id_rede_social: id_rede_social
            }
        })
    } catch (error) {
        console.error("Erro ao buscar relação por usuário e rede social:", error)
        return false
    }
}

module.exports = {
    insertRedeSocialUsuario,
    updateRedeSocialUsuario,
    deleteRedeSocialUsuario,
    selectAllRedesSociaisUsuario,
    selectByIdRedeSocialUsuario,
    selectByUsuarioAndRedeSocial
}