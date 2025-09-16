const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()


async function insertTipoDocumento(tipo) {
    try {
        return await prisma.tipo_documento.create({ data: { nome: tipo.nome } });
    } catch (error) {
        console.error("Erro ao inserir tipo_documento:", error);
        return false;
    }
}

async function updateTipoDocumento(tipo) {
    try {
        return await prisma.tipo_documento.update({
            where: { id_tipo: tipo.id_tipo },
            data: { nome: tipo.nome }
        });
    } catch (error) {
        console.error("Erro ao atualizar tipo_documento:", error);
        return false;
    }
}

async function deleteTipoDocumento(id) {
    try {
        await prisma.tipo_documento.delete({ where: { id_tipo: id } });
        return true;
    } catch (error) {
        console.error("Erro ao deletar tipo_documento:", error);
        return false;
    }
}

async function selectAllTipoDocumento() {
    try {
        return await prisma.tipo_documento.findMany({ orderBy: { id_tipo: 'desc' } });
    } catch (error) {
        console.error("Erro ao buscar tipo_documento:", error);
        return false;
    }
}

async function selectByIdTipoDocumento(id) {
    try {
        return await prisma.tipo_documento.findUnique({ where: { id_tipo: id } });
    } catch (error) {
        console.error("Erro ao buscar tipo_documento por ID:", error);
        return false;
    }
}

module.exports = {
    insertTipoDocumento, 
    updateTipoDocumento, 
    deleteTipoDocumento, 
    selectAllTipoDocumento, 
    selectByIdTipoDocumento
}