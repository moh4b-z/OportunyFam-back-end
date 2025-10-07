const { PrismaClient } = require('@prisma/client')
const prismaMySQL = PrismaClient

async function insertInstituicaoTipoInstituicao(dados){
    try {
        let result = await prismaMySQL.tbl_instituicao_tipo_instituicao.create({
            data: {
                id_instituicao: dados.id_instituicao,
                id_tipo_instituicao: dados.id_tipo_instituicao
            }
        })
        return result
    } catch (error) {
        console.error("Erro DAO: Erro ao inserir relacionamento InstituicaoTipoInstituicao.", error)
        return false
    }
}

async function deleteInstituicaoTipoInstituicao(idInstituicao, idTipoInstituicao){
    try {
        // Usa o $executeRaw para DELETE baseado em chave composta (UNIQUE KEY)
        let result = await prismaMySQL.$executeRaw`DELETE FROM tbl_instituicao_tipo_instituicao WHERE id_instituicao = ${idInstituicao} AND id_tipo_instituicao = ${idTipoInstituicao}`
        // Se a deleção ocorreu (1 linha afetada), retorna true
        return result >= 1 ? true : false
    } catch (error) {
        console.error("Erro DAO: Erro ao deletar relacionamento InstituicaoTipoInstituicao.", error)
        return false
    }
}

module.exports = {
    insertInstituicaoTipoInstituicao,
    deleteInstituicaoTipoInstituicao
}