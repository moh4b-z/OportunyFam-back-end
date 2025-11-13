const { PrismaClient } = require('../../../../prisma/generated/client')
const prismaMySQL = new PrismaClient()

async function insertAtividade(atividade){
    try {
        return await prismaMySQL.tbl_atividade.create({
            data: {
                id_instituicao: atividade.id_instituicao,
                id_categoria: atividade.id_categoria,
                titulo: atividade.titulo,
                foto: atividade.foto,
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
            foto: atividade.foto,
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

async function selectAllAtividades() {
    try {
        // A view 'vw_atividade_detalhe' já tem a coluna 'aulas' pronta.
        // Não precisamos de JOINs ou GROUP BY aqui.
        const result = await prismaMySQL.$queryRaw`
            SELECT * FROM vw_atividade_detalhe
            ORDER BY atividade_id DESC
        `;
        return result;
    } catch (error) {
        console.error("Erro ao buscar atividades:", error);
        return false;
    }
}

async function selectByIdAtividade(id) {
    try {
        // A view já fez todo o trabalho. Só precisamos filtrar pelo ID.
        const result = await prismaMySQL.$queryRaw`
            SELECT * FROM vw_atividade_detalhe
            WHERE atividade_id = ${id}
        `;
        
        // Retorna o primeiro (e único) resultado, ou null se não encontrar
        return result.length > 0 ? result[0] : null;
    } catch (error) {
        console.error("Erro ao buscar atividade por ID:", error);
        return false;
    }
}

async function selectByIdInstituicaoAtividade(id) {
    try {
        // Mesmo caso: a view já montou tudo. Só filtramos pela instituição.
        const result = await prismaMySQL.$queryRaw`
            SELECT *
            FROM vw_atividade_detalhe
            WHERE instituicao_id = ${id}
            ORDER BY atividade_id DESC
        `;
        
        // Retorna a lista de atividades (ou null se a lista for vazia)
        return result.length > 0 ? result : null;
    } catch (error) {
        console.error("Erro ao buscar atividades por instituição:", error);
        return false;
    }
}

module.exports = {
    insertAtividade,
    updateAtividade,
    deleteAtividade,
    selectAllAtividades,
    selectByIdAtividade,
    selectByIdInstituicaoAtividade
}