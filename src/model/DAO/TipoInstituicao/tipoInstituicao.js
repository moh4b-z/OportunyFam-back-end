const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()


async function insertTipoInstituicao(tipo) {
    try {
        return await prisma.tipo_instituicao.create({ data: { nome: tipo.nome } });
    } catch (error) {
        console.error("Erro ao inserir tipo_instituicao:", error);
        return false;
    }
}

async function updateTipoInstituicao(tipo) {
    try {
        return await prisma.tipo_instituicao.update({
            where: { id_tipo: tipo.id_tipo },
            data: { nome: tipo.nome }
        });
    } catch (error) {
        console.error("Erro ao atualizar tipo_instituicao:", error);
        return false;
    }
}

async function deleteTipoInstituicao(id) {
    try {
        await prisma.tipo_instituicao.delete({ where: { id_tipo: id } });
        return true;
    } catch (error) {
        console.error("Erro ao deletar tipo_instituicao:", error);
        return false;
    }
}

async function selectAllTipoInstituicao() {
    try {
        return await prisma.tipo_instituicao.findMany({ orderBy: { id_tipo: 'desc' } });
    } catch (error) {
        console.error("Erro ao buscar tipo_instituicao:", error);
        return false;
    }
}

async function selectByIdTipoInstituicao(id) {
    try {
        return await prisma.tipo_instituicao.findUnique({ where: { id_tipo: id } });
    } catch (error) {
        console.error("Erro ao buscar tipo_instituicao por ID:", error);
        return false;
    }
}

module.exports = {
    insertTipoInstituicao, 
    updateTipoInstituicao, 
    deleteTipoInstituicao, 
    selectAllTipoInstituicao, 
    selectByIdTipoInstituicao
}