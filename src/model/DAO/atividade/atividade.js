const { PrismaClient } = require('../../../../prisma/generated/mysql')
const prismaMySQL = new PrismaClient()

async function insertAtividade(atividade){
    try {
        return await prismaMySQL.tbl_atividades.create({
            data: {
                id_instituicao: atividade.id_instituicao,
                id_categoria: atividade.id_categoria,
                titulo: atividade.titulo,
                descricao: atividade.descricao,
                faixa_etaria_min: atividade.faixa_etaria_min,
                faixa_etaria_max: atividade.faixa_etaria_max,
                gratuita: atividade.gratuita,
                preco: atividade.preco,
                ativo: atividade.ativo
            }
        })
    } catch (error) {
        console.error("Erro ao inserir atividade:", error)
        return false
    }
}

async function updateAtividade(atividade){
    try {
        // Objeto de dados, apenas com os campos que podem ser atualizados
        const data = {
            titulo: atividade.titulo,
            descricao: atividade.descricao,
            faixa_etaria_min: atividade.faixa_etaria_min,
            faixa_etaria_max: atividade.faixa_etaria_max,
            gratuita: atividade.gratuita,
            preco: atividade.preco,
            ativo: atividade.ativo
        }

        if (atividade.id_instituicao) data.id_instituicao = atividade.id_instituicao
        if (atividade.id_categoria) data.id_categoria = atividade.id_categoria

        return await prismaMySQL.tbl_atividades.update({
            where: { id: atividade.id },
            data: data
        })
    } catch (error) {
        console.error("Erro ao atualizar atividade:", error)
        return false
    }
}

async function deleteAtividade(id){
    try {
        await prismaMySQL.tbl_atividades.delete({ where: { id: id } })
        return true
    } catch (error) {
        console.error("Erro ao deletar atividade:", error)
        return false
    }
}

async function selectAllAtividades(){
    try {
        // Busca usando a VIEW para enriquecer os dados
        return await prismaMySQL.$queryRaw`SELECT * FROM vw_atividade_detalhe ORDER BY atividade_id DESC`
    } catch (error) {
        console.error("Erro ao buscar atividades:", error)
        return false
    }
}

async function selectByIdAtividade(id){
    try {
        const result = await prismaMySQL.$queryRaw`SELECT * FROM vw_atividade_detalhe WHERE atividade_id = ${id}`
        return result.length > 0 ? result[0] : null
    } catch (error) {
        console.error("Erro ao buscar atividade por ID:", error)
        return false
    }
}

module.exports = {
    insertAtividade,
    updateAtividade,
    deleteAtividade,
    selectAllAtividades,
    selectByIdAtividade
}