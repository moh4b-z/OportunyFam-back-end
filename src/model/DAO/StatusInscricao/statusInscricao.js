const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function insertStatusInscricao(status) {
    try {
        return await prisma.status_inscricao.create({ data: { nome: status.nome } });
    } catch (error) {
        console.error("Erro ao inserir status_inscricao:", error);
        return false;
    }
}

async function updateStatusInscricao(status) {
    try {
        return await prisma.status_inscricao.update({
            where: { id_status: status.id_status },
            data: { nome: status.nome }
        });
    } catch (error) {
        console.error("Erro ao atualizar status_inscricao:", error);
        return false;
    }
}

async function deleteStatusInscricao(id) {
    try {
        await prisma.status_inscricao.delete({ where: { id_status: id } });
        return true;
    } catch (error) {
        console.error("Erro ao deletar status_inscricao:", error);
        return false;
    }
}

async function selectAllStatusInscricao() {
    try {
        return await prisma.status_inscricao.findMany({ orderBy: { id_status: 'desc' } });
    } catch (error) {
        console.error("Erro ao buscar status_inscricao:", error);
        return false;
    }
}

async function selectByIdStatusInscricao(id) {
    try {
        return await prisma.status_inscricao.findUnique({ where: { id_status: id } });
    } catch (error) {
        console.error("Erro ao buscar status_inscricao por ID:", error);
        return false;
    }
}

module.exports = {
    insertStatusInscricao, 
    updateStatusInscricao, 
    deleteStatusInscricao, 
    selectAllStatusInscricao, 
    selectByIdStatusInscricao
}