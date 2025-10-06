const { PrismaClient: MySQLClient } = require('../../../generated/mysql')
const prismaMySQL = new MySQLClient()

async function insertRedeSocial(redeSocial){
    try {
        return await prismaMySQL.tbl_rede_social.create({
            data: {
                nome: redeSocial.nome,
                icone: redeSocial.icone
            }
        })
    } catch (error) {
        console.error("Erro ao inserir rede social:", error)
        return false
    }
}

async function updateRedeSocial(redeSocial){
    try {
        return await prismaMySQL.tbl_rede_social.update({
            where: { id: redeSocial.id },
            data: {
                nome: redeSocial.nome,
                icone: redeSocial.icone
            }
        })
    } catch (error) {
        console.error("Erro ao atualizar rede social:", error)
        return false
    }
}

async function deleteRedeSocial(id){
    try {
        await prismaMySQL.tbl_rede_social.delete({ where: { id: id } })
        return true
    } catch (error) {
        console.error("Erro ao deletar rede social:", error)
        return false
    }
}

async function selectAllRedesSociais(){
    try {
        return await prismaMySQL.tbl_rede_social.findMany({
            orderBy: { nome: 'asc' }
        })
    } catch (error) {
        console.error("Erro ao buscar todas as redes sociais:", error)
        return false
    }
}

async function selectByIdRedeSocial(id){
    try {
        return await prismaMySQL.tbl_rede_social.findUnique({
            where: { id: id }
        })
    } catch (error) {
        console.error("Erro ao buscar rede social por ID:", error)
        return false
    }
}

module.exports = {
    insertRedeSocial,
    updateRedeSocial,
    deleteRedeSocial,
    selectAllRedesSociais,
    selectByIdRedeSocial
}