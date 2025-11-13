const { PrismaClient } = require('../../../../../prisma/generated/client')
const prismaMySQL = new PrismaClient()

async function insertTipoInstituicao(tipoInstituicao){
    try {
        let result = await prismaMySQL.tbl_tipo_instituicao.create({
            data: {
                nome: tipoInstituicao.nome
            }
        })
        return result
    } catch (error) {
        console.error("Erro DAO: Erro ao inserir tipo de instituição.", error)
        return false
    }
}

async function updateTipoInstituicao(tipoInstituicao){
    try {
        let result = await prismaMySQL.tbl_tipo_instituicao.update({
            where: { id: tipoInstituicao.id },
            data: {
                nome: tipoInstituicao.nome
            }
        })
        return result
    } catch (error) {
        console.error("Erro DAO: Erro ao atualizar tipo de instituição.", error)
        return false
    }
}

async function deleteTipoInstituicao(id){
    try {
        let result = await prismaMySQL.tbl_tipo_instituicao.delete({ where: { id: id } })
        return result ? true : false
    } catch (error) {
        console.error("Erro DAO: Erro ao deletar tipo de instituição.", error)
        return false
    }
}

async function selectAllTipoInstituicao(){
    try {
        let result = await prismaMySQL.$queryRaw`SELECT * FROM tbl_tipo_instituicao ORDER BY nome ASC`
        return result
    } catch (error) {
        console.error("Erro DAO: Erro ao buscar todos os tipos de instituição.", error)
        return false
    }
}

async function selectByIdTipoInstituicao(id){
    try {
        let result = await prismaMySQL.$queryRaw`SELECT * FROM tbl_tipo_instituicao WHERE id = ${id}`
        return result.length > 0 ? result[0] : null
    } catch (error) {
        console.error("Erro DAO: Erro ao buscar tipo de instituição por ID.", error)
        return false
    }
}

module.exports = {
    insertTipoInstituicao,
    updateTipoInstituicao,
    deleteTipoInstituicao,
    selectAllTipoInstituicao,
    selectByIdTipoInstituicao
}