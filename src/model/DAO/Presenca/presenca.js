const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function insertPresenca(presenca) {
    try {
        return await prisma.presenca.create({ data: { nome: presenca.nome } });
    } catch (error) {
        console.error("Erro ao inserir presenca:", error);
        return false;
    }
}

async function updatePresenca(presenca) {
    try {
        return await prisma.presenca.update({
            where: { id_presenca: presenca.id_presenca },
            data: { nome: presenca.nome }
        });
    } catch (error) {
        console.error("Erro ao atualizar presenca:", error);
        return false;
    }
}

async function deletePresenca(id) {
    try {
        await prisma.presenca.delete({ where: { id_presenca: id } });
        return true;
    } catch (error) {
        console.error("Erro ao deletar presenca:", error);
        return false;
    }
}

async function selectAllPresenca() {
    try {
        return await prisma.presenca.findMany({ orderBy: { id_presenca: 'desc' } });
    } catch (error) {
        console.error("Erro ao buscar presencas:", error);
        return false;
    }
}

async function selectByIdPresenca(id) {
    try {
        return await prisma.presenca.findUnique({ where: { id_presenca: id } });
    } catch (error) {
        console.error("Erro ao buscar presenca por ID:", error);
        return false;
    }
}

module.exports = {
    insertPresenca, 
    updatePresenca, 
    deletePresenca, 
    selectAllPresenca, 
    selectByIdPresenca
}