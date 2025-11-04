const { PrismaClient } = require('@prisma/client')
const prismaMySQL = new PrismaClient()

async function insertAtividade(atividade){
    try {
        return await prismaMySQL.tbl_atividade.create({
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

        return await prismaMySQL.tbl_atividade.update({
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
        await prismaMySQL.tbl_atividade.delete({ where: { id: id } })
        return true
    } catch (error) {
        console.error("Erro ao deletar atividade:", error)
        return false
    }
}

async function selectAllAtividades(){
    try {
        // Busca usando a VIEW para enriquecer os dados
        const result = await prismaMySQL.$queryRaw`
            SELECT 
                a.*,
                JSON_ARRAYAGG(
                    JSON_OBJECT(
                        'aula_id', aa.id,
                        'data_aula', aa.data_aula,
                        'hora_inicio', aa.hora_inicio,
                        'hora_fim', aa.hora_fim,
                        'vagas_total', aa.vagas_total,
                        'vagas_disponiveis', aa.vagas_disponiveis,
                        'status', vad.status_aula
                    )
                ) as aulas
            FROM vw_atividade_detalhe a
            LEFT JOIN vw_aulas_detalhe vad ON vad.id_atividade = a.atividade_id
            LEFT JOIN tbl_aulas_atividade aa ON aa.id = vad.aula_id
            GROUP BY a.atividade_id
            ORDER BY a.atividade_id DESC
        `
        return result
    } catch (error) {
        console.error("Erro ao buscar atividades:", error)
        return false
    }
}

async function selectByIdAtividade(id){
    try {
        const result = await prismaMySQL.$queryRaw`
            SELECT 
                a.*,
                JSON_ARRAYAGG(
                    JSON_OBJECT(
                        'aula_id', aa.id,
                        'data_aula', aa.data_aula,
                        'hora_inicio', aa.hora_inicio,
                        'hora_fim', aa.hora_fim,
                        'vagas_total', aa.vagas_total,
                        'vagas_disponiveis', aa.vagas_disponiveis,
                        'status', vad.status_aula
                    )
                ) as aulas
            FROM vw_atividade_detalhe a
            LEFT JOIN vw_aulas_detalhe vad ON vad.id_atividade = a.atividade_id
            LEFT JOIN tbl_aulas_atividade aa ON aa.id = vad.aula_id
            WHERE a.atividade_id = ${id}
            GROUP BY a.atividade_id`
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