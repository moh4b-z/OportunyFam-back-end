const { PrismaClient: MySQLClient } = require('../../../generated/mysql')
const prismaMySQL = new MySQLClient()

async function insertRedeSocialInstituicao(redeSocialInstituicao){
    try {
        return await prismaMySQL.redeSocialInstituicao.create({
            data: {
                id_instituicao: redeSocialInstituicao.id_instituicao,
                id_rede_social: redeSocialInstituicao.id_rede_social,
                link_perfil: redeSocialInstituicao.link_perfil,
                link_abreviado: redeSocialInstituicao.link_abreviado,
                numero_telefone: redeSocialInstituicao.numero_telefone,
                descricao: redeSocialInstituicao.descricao
            }
        })
    } catch (error) {
        console.error("Erro ao inserir relação rede social-instituição:", error)
        return false
    }
}

async function updateRedeSocialInstituicao(redeSocialInstituicao){
    try {
        return await prismaMySQL.redeSocialInstituicao.update({
            where: { id: redeSocialInstituicao.id },
            data: {
                id_instituicao: redeSocialInstituicao.id_instituicao,
                id_rede_social: redeSocialInstituicao.id_rede_social,
                link_perfil: redeSocialInstituicao.link_perfil,
                link_abreviado: redeSocialInstituicao.link_abreviado,
                numero_telefone: redeSocialInstituicao.numero_telefone,
                descricao: redeSocialInstituicao.descricao
            }
        })
    } catch (error) {
        console.error("Erro ao atualizar relação rede social-instituição:", error)
        return false
    }
}

async function deleteRedeSocialInstituicao(id){
    try {
        await prismaMySQL.redeSocialInstituicao.delete({ where: { id: id } })
        return true
    } catch (error) {
        console.error("Erro ao deletar relação rede social-instituição:", error)
        return false
    }
}

async function selectAllRedesSociaisInstituicao(){
    try {
        return await prismaMySQL.redeSocialInstituicao.findMany({
            orderBy: { id: 'desc' }
        })
    } catch (error) {
        console.error("Erro ao buscar todas as relações rede social-instituição:", error)
        return false
    }
}

async function selectByIdRedeSocialInstituicao(id){
    try {
        return await prismaMySQL.redeSocialInstituicao.findUnique({
            where: { id: id }
        })
    } catch (error) {
        console.error("Erro ao buscar relação rede social-instituição por ID:", error)
        return false
    }
}

async function selectByInstituicaoAndRedeSocial(id_instituicao, id_rede_social){
    try {
        return await prismaMySQL.redeSocialInstituicao.findFirst({
            where: {
                id_instituicao: id_instituicao,
                id_rede_social: id_rede_social
            }
        })
    } catch (error) {
        console.error("Erro ao buscar relação por instituição e rede social:", error)
        return false
    }
}

module.exports = {
    insertRedeSocialInstituicao,
    updateRedeSocialInstituicao,
    deleteRedeSocialInstituicao,
    selectAllRedesSociaisInstituicao,
    selectByIdRedeSocialInstituicao,
    selectByInstituicaoAndRedeSocial
}