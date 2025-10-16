const { PrismaClient } = require('../../../../prisma/generated/mysql')
const prismaMySQL = new PrismaClient()

async function insertMatriculaAula(dadosMatricula){
    try {
        const novaMatricula = {
            id_inscricao_atividade: dadosMatricula.id_inscricao_atividade,
            id_aula_atividade: dadosMatricula.id_aula_atividade,
            presente: dadosMatricula.presente,
            nota_observacao: dadosMatricula.nota_observacao || null
        }
        return await prismaMySQL.tbl_matricula_aula.create({
            data: novaMatricula
        })
    } catch (error) {
        // Erro 1062 = Unique constraint failed (tentativa de registrar a mesma criança/aula 2x)
        console.error("Erro ao inserir matrícula de aula:", error)
        return false
    }
}

// --- SELECT BY INSCRICAO / READ BY INSCRICAO ---
async function selectMatriculasByInscricao(idInscricao){
    try {
        return await prismaMySQL.tbl_matricula_aula.findMany({
            where: { id_inscricao_atividade: parseInt(idInscricao) },
            include: {
                tbl_aulas_atividade: {
                    select: { dia_semana: true, hora_inicio: true, hora_fim: true }
                }
            },
            orderBy: { id_aula_atividade: 'asc' }
        })
    } catch (error) {
        console.error("Erro ao buscar matrículas por inscrição:", error)
        return false
    }
}

// --- UPDATE / UPDATE (Usado principalmente para marcar Presença) ---
async function updateMatriculaAula(id, dadosAtualizados){
    try {
        return await prismaMySQL.tbl_matricula_aula.update({
            where: { id: parseInt(id) },
            data: {
                presente: dadosAtualizados.presente,
                nota_observacao: dadosAtualizados.nota_observacao
            }
        })
    } catch (error) {
        console.error("Erro ao atualizar matrícula de aula:", error)
        return false
    }
}

// --- DELETE / DELETE ---
async function deleteMatriculaAula(id){
    try {
        await prismaMySQL.tbl_matricula_aula.delete({ where: { id: parseInt(id) } })
        return true
    } catch (error) {
        console.error("Erro ao deletar matrícula de aula:", error)
        return false
    }
}

module.exports = {
    insertMatriculaAula,
    selectMatriculasByInscricao,
    updateMatriculaAula,
    deleteMatriculaAula
}