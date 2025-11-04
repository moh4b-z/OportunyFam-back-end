const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()


async function insertGenero(genero) {
    try {
        return await prisma.genero.create({ data: { nome: genero.nome } });
    } catch (error) {
        console.error("Erro ao inserir genero:", error);
        return false;
    }
}

async function updateGenero(genero) {
    try {
        return await prisma.genero.update({
            where: { id_genero: genero.id_genero },
            data: { nome: genero.nome }
        });
    } catch (error) {
        console.error("Erro ao atualizar genero:", error);
        return false;
    }
}

async function deleteGenero(id) {
    try {
        await prisma.genero.delete({ where: { id_genero: id } });
        return true;
    } catch (error) {
        console.error("Erro ao deletar genero:", error);
        return false;
    }
}

async function selectAllGenero() {
    try {
        return await prisma.genero.findMany({ orderBy: { id_genero: 'desc' } });
    } catch (error) {
        console.error("Erro ao buscar generos:", error);
        return false;
    }
}

async function selectByIdGenero(id) {
    try {
        return await prisma.genero.findUnique({ where: { id_genero: id } });
    } catch (error) {
        console.error("Erro ao buscar genero por ID:", error);
        return false;
    }
}


module.exports = {
    insertGenero, 
    updateGenero, 
    deleteGenero, 
    selectAllGenero, 
    selectByIdGenero
}