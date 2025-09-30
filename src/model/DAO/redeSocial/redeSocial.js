const { PrismaClient: MySQLClient } = require('../../../generated/mysql')
const prismaMySQL = new MySQLClient()

async function insertRedeSocial(redeSocial){
    try {
        return await prismaMySQL.redeSocial.create({
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
        return await prismaMySQL.redeSocial.update({
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
        await prismaMySQL.redeSocial.delete({ where: { id: id } })
        return true
    } catch (error) {
        console.error("Erro ao deletar rede social:", error)
        return false
    }
}

async function selectAllRedesSociais(){
    try {
        return await prismaMySQL.redeSocial.findMany({
            orderBy: { nome: 'asc' }
        })
    } catch (error) {
        console.error("Erro ao buscar todas as redes sociais:", error)
        return false
    }
}

async function selectByIdRedeSocial(id){
    try {
        return await prismaMySQL.redeSocial.findUnique({
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