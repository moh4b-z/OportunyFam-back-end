const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function insertStatusDenuncia(status) {
    try {
        return await prisma.status_denuncia.create({ data: { nome: status.nome } });
    } catch (error) {
        console.error("Erro ao inserir status_denuncia:", error);
        return false;
    }
}

async function updateStatusDenuncia(status) {
    try {
        return await prisma.status_denuncia.update({
            where: { id_status: status.id_status },
            data: { nome: status.nome }
        });
    } catch (error) {
        console.error("Erro ao atualizar status_denuncia:", error);
        return false;
    }
}

async function deleteStatusDenuncia(id) {
    try {
        await prisma.status_denuncia.delete({ where: { id_status: id } });
        return true;
    } catch (error) {
        console.error("Erro ao deletar status_denuncia:", error);
        return false;
    }
}

async function selectAllStatusDenuncia() {
    try {
        return await prisma.status_denuncia.findMany({ orderBy: { id_status: 'desc' } });
    } catch (error) {
        console.error("Erro ao buscar status_denuncia:", error);
        return false;
    }
}

async function selectByIdStatusDenuncia(id) {
    try {
        return await prisma.status_denuncia.findUnique({ where: { id_status: id } });
    } catch (error) {
        console.error("Erro ao buscar status_denuncia por ID:", error);
        return false;
    }
}


module.exports = {
    insertStatusDenuncia, 
    updateStatusDenuncia, 
    deleteStatusDenuncia, 
    selectAllStatusDenuncia, 
    selectByIdStatusDenuncia
}