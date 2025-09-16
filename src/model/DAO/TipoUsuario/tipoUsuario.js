const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()


async function insertTipoUsuario(tipo) {
    try {
        const novo = await prisma.tipo_usuario.create({
            data: { nome: tipo.nome }
        });
        return novo;
    } catch (error) {
        console.error("Erro ao inserir tipo_usuario:", error);
        return false;
    }
}

async function updateTipoUsuario(tipo) {
    try {
        const atualizado = await prisma.tipo_usuario.update({
            where: { id_tipo: tipo.id_tipo },
            data: { nome: tipo.nome }
        });
        return atualizado;
    } catch (error) {
        console.error("Erro ao atualizar tipo_usuario:", error);
        return false;
    }
}

async function deleteTipoUsuario(id) {
    try {
        await prisma.tipo_usuario.delete({ where: { id_tipo: id } });
        return true;
    } catch (error) {
        console.error("Erro ao deletar tipo_usuario:", error);
        return false;
    }
}

async function selectAllTipoUsuario() {
    try {
        return await prisma.tipo_usuario.findMany({ orderBy: { id_tipo: 'desc' } });
    } catch (error) {
        console.error("Erro ao buscar tipo_usuario:", error);
        return false;
    }
}

async function selectByIdTipoUsuario(id) {
    try {
        return await prisma.tipo_usuario.findUnique({ where: { id_tipo: id } });
    } catch (error) {
        console.error("Erro ao buscar tipo_usuario por ID:", error);
        return false;
    }
}


module.exports = {
    insertTipoUsuario, 
    updateTipoUsuario, 
    deleteTipoUsuario, 
    selectAllTipoUsuario, 
    selectByIdTipoUsuario
}