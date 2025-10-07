const { PrismaClient } = require('@prisma/client')
const prismaMySQL = new PrismaClient()

async function insertAula(aula){
    try {
        return await prismaMySQL.tbl_aulas_atividade.create({
            data: {
                id_atividade: aula.id_atividade,
                dia_semana: aula.dia_semana,
                hora_inicio: aula.hora_inicio,
                hora_fim: aula.hora_fim,
                vagas_total: aula.vagas_total,
                vagas_disponiveis: aula.vagas_disponiveis,
                ativo: aula.ativo
            }
        })
    } catch (error) {
        console.error("Erro ao inserir aula:", error)
        return false
    }
}

async function updateAula(aula){
    try {
        // Não permite alteração de id_atividade ou id no update de dados.
        return await prismaMySQL.tbl_aulas_atividade.update({
            where: { id: aula.id },
            data: {
                dia_semana: aula.dia_semana,
                hora_inicio: aula.hora_inicio,
                hora_fim: aula.hora_fim,
                vagas_total: aula.vagas_total,
                vagas_disponiveis: aula.vagas_disponiveis,
                ativo: aula.ativo
            }
        })
    } catch (error) {
        console.error("Erro ao atualizar aula:", error)
        return false
    }
}

async function deleteAula(id){
    try {
        await prismaMySQL.tbl_aulas_atividade.delete({ where: { id: id } })
        return true
    } catch (error) {
        console.error("Erro ao deletar aula:", error)
        return false
    }
}

async function selectByIdAula(id){
    try {
        return await prismaMySQL.tbl_aulas_atividade.findUnique({ where: { id: id } })
    } catch (error) {
        console.error("Erro ao buscar aula por ID:", error)
        return null
    }
}

async function selectAllAulas(){
    try {
        return await prismaMySQL.tbl_aulas_atividade.findMany({ orderBy: { id: 'desc' } })
    } catch (error) {
        console.error("Erro ao buscar todas as aulas:", error)
        return false
    }
}

async function selectAulasByInstituicaoId(idInstituicao){
    try {
        // Esta queryRaw usa JOIN para conectar aulas_atividade -> atividades -> instituicao
        const result = await prismaMySQL.$queryRaw`
            SELECT 
                aa.*, a.titulo AS nome_atividade
            FROM tbl_aulas_atividade aa
            JOIN tbl_atividades a ON a.id = aa.id_atividade
            WHERE a.id_instituicao = ${idInstituicao}
            ORDER BY a.titulo, aa.dia_semana, aa.hora_inicio
        `
        return result
    } catch (error) {
        console.error("Erro ao buscar aulas por Instituição:", error)
        return false
    }
}


module.exports = {
    insertAula,
    updateAula,
    deleteAula,
    selectByIdAula,
    selectAllAulas,
    selectAulasByInstituicaoId
}