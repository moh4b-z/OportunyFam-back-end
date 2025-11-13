const { PrismaClient } = require('../../../../../prisma/generated/client')
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
        return await prismaMySQL.$queryRaw`
            SELECT 
                ma.id,
                ma.presente,
                ma.nota_observacao,
                ma.criado_em,
                ma.atualizado_em,
                vad.aula_id,
                vad.data_aula,
                vad.hora_inicio,
                vad.hora_fim,
                vad.status_aula
            FROM tbl_matricula_aula ma
            JOIN vw_aulas_detalhe vad ON vad.aula_id = ma.id_aula_atividade
            WHERE ma.id_inscricao_atividade = ${parseInt(idInscricao)}
            ORDER BY vad.data_aula ASC, vad.hora_inicio ASC
        `
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