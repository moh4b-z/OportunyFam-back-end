const { PrismaClient } = require('../../../../../prisma/generated/client')
const prismaMySQL = new PrismaClient()

async function insertAula(aula){
    try {
        // Converte data_aula para objeto Date
        const data_aula = new Date(aula.data_aula)
        
        // Extrai horas e minutos das strings hora_inicio e hora_fim
        const [horaInicio, minInicio] = aula.hora_inicio.split(':')
        const [horaFim, minFim] = aula.hora_fim.split(':')
        
        // Cria objetos Date para hora_inicio e hora_fim usando a mesma data base
        const hora_inicio = new Date(data_aula)
        hora_inicio.setHours(parseInt(horaInicio), parseInt(minInicio), 0)
        
        const hora_fim = new Date(data_aula)
        hora_fim.setHours(parseInt(horaFim), parseInt(minFim), 0)

        const data = {
            id_atividade: aula.id_atividade,
            data_aula: data_aula,
            hora_inicio: hora_inicio,
            hora_fim: hora_fim,
            vagas_total: aula.vagas_total
        }

        // incluir vagas_disponiveis somente se fornecido (trigger calcula se for NULL)
        if (aula.vagas_disponiveis !== undefined) {
            data.vagas_disponiveis = aula.vagas_disponiveis
        }

        return await prismaMySQL.tbl_aulas_atividade.create({ data })
    } catch (error) {
        console.error("Erro ao inserir aula:", error)
        return false
    }
}

async function updateAula(aula){
    try {
        // Não permite alteração de id_atividade ou id no update de dados.
        const data = {}

        if (aula.data_aula) {
            data.data_aula = new Date(aula.data_aula)

            // Se tiver data_aula e horários, atualiza os horários usando a nova data
            if (aula.hora_inicio) {
                const [horaInicio, minInicio] = aula.hora_inicio.split(':')
                const hora_inicio = new Date(data.data_aula)
                hora_inicio.setHours(parseInt(horaInicio), parseInt(minInicio), 0)
                data.hora_inicio = hora_inicio
            }
            
            if (aula.hora_fim) {
                const [horaFim, minFim] = aula.hora_fim.split(':')
                const hora_fim = new Date(data.data_aula)
                hora_fim.setHours(parseInt(horaFim), parseInt(minFim), 0)
                data.hora_fim = hora_fim
            }
        } else {
            // Se não tiver data_aula mas tiver horários, usa a data atual da aula
            if (aula.hora_inicio || aula.hora_fim) {
                const aulaAtual = await prismaMySQL.tbl_aulas_atividade.findUnique({
                    where: { id: aula.id }
                })

                if (aula.hora_inicio) {
                    const [horaInicio, minInicio] = aula.hora_inicio.split(':')
                    const hora_inicio = new Date(aulaAtual.data_aula)
                    hora_inicio.setHours(parseInt(horaInicio), parseInt(minInicio), 0)
                    data.hora_inicio = hora_inicio
                }
                
                if (aula.hora_fim) {
                    const [horaFim, minFim] = aula.hora_fim.split(':')
                    const hora_fim = new Date(aulaAtual.data_aula)
                    hora_fim.setHours(parseInt(horaFim), parseInt(minFim), 0)
                    data.hora_fim = hora_fim
                }
            }
        }

        if (aula.vagas_total !== undefined) {
            data.vagas_total = aula.vagas_total
        }

        if (aula.vagas_disponiveis !== undefined) {
            data.vagas_disponiveis = aula.vagas_disponiveis
        }

        return await prismaMySQL.tbl_aulas_atividade.update({ where: { id: aula.id }, data })
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
        const result = await prismaMySQL.$queryRaw`
            SELECT * FROM vw_aulas_detalhe 
            WHERE aula_id = ${id}`
        return result.length > 0 ? result[0] : null
    } catch (error) {
        console.error("Erro ao buscar aula por ID:", error)
        return null
    }
}

async function selectAllAulas(){
    try {
        return await prismaMySQL.$queryRaw`
            SELECT * FROM vw_aulas_detalhe 
            ORDER BY data_aula DESC, hora_inicio ASC`
    } catch (error) {
        console.error("Erro ao buscar todas as aulas:", error)
        return false
    }
}

async function selectAulasByInstituicaoId(idInstituicao){
    try {
        // Usando a view de alunos_instituicao e aulas_detalhe
        const result = await prismaMySQL.$queryRaw`
            SELECT 
                vad.*,
                a.titulo as nome_atividade,
                i.instituicao_nome
            FROM vw_aulas_detalhe vad
            JOIN tbl_atividade a ON a.id = vad.id_atividade
            JOIN vw_alunos_instituicao i ON i.instituicao_id = ${idInstituicao}
                AND i.atividade_id = a.id
            ORDER BY a.titulo, vad.data_aula, vad.hora_inicio
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