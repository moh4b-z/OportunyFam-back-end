const { PrismaClient } = require('../../../../prisma/generated/mysql')
const prismaMySQL = new PrismaClient()

async function  insertCrianca(crianca){
    try {
        // Usa procedure para inserir pessoa + crianca e retornar o id
        const result = await prismaMySQL.$queryRawUnsafe(`
            CALL sp_inserir_crianca(?, ?, ?, ?, ?, ?, ?, ?);
        `,
        crianca.nome,
        crianca.email,
        crianca.senha,
        crianca.telefone || null,
        crianca.foto_perfil || null,
        crianca.cpf || null,
        crianca.data_nascimento ? new Date(crianca.data_nascimento) : null,
        crianca.id_sexo)

        const insertedRow = result[0]
        const inserted_id = insertedRow?.crianca_id || insertedRow?.f0
        if (!inserted_id) {
            console.error("A SP de inserção de criança não retornou um ID válido.")
            return false
        }

        const criancaCompleta = await selectByIdCrianca(inserted_id)
        if (criancaCompleta) criancaCompleta.id = criancaCompleta.crianca_id || inserted_id
        return criancaCompleta
    } catch (error) {
        console.error("Erro ao inserir criança:", error)
        return false
    }
}

async function  updateCrianca(crianca){
    try {
        // Atualiza via procedure para manter lógica de tbl_pessoa + tbl_crianca
        const id_crianca = crianca.id
        await prismaMySQL.$queryRawUnsafe(`
            CALL sp_atualizar_crianca(?, ?, ?, ?, ?, ?, ?, ?, ?);
        `,
        id_crianca,
        crianca.nome,
        crianca.email,
        crianca.senha,
        crianca.telefone || null,
        crianca.foto_perfil || null,
        crianca.cpf || null,
        crianca.data_nascimento ? new Date(crianca.data_nascimento) : null,
        crianca.id_sexo)

        const atualizado = await selectByIdCrianca(id_crianca)
        if (atualizado) atualizado.id = atualizado.crianca_id || id_crianca
        return atualizado
    } catch (error) {
        console.error("Erro ao atualizar criança:", error)
        return false
    }
}

async function  deleteCrianca(id){
    try {
        // Deleta a pessoa relacionada para acionar cascade e remover tudo
        const crianca = await selectByIdCrianca(id)
        if (!crianca) return false
        const pessoa_id = crianca.pessoa_id
        if (!pessoa_id) return false
        await prismaMySQL.tbl_pessoa.delete({ where: { id: pessoa_id } })
        return true
    } catch (error) {
        console.error("Erro ao deletar criança:", error)
        return false
    }
}

async function  selectAllCriancas(){
    try {
        let result = await prismaMySQL.$queryRaw`SELECT * FROM vw_crianca_completa ORDER BY crianca_id DESC`
        return result.map(r => ({ ...r, id: r.crianca_id }))
    } catch (error) {
        console.error("Erro ao buscar todas as crianças:", error)
        return false
    }
}

async function  selectByIdCrianca(id){
    try {
        let result = await prismaMySQL.$queryRaw`SELECT * FROM vw_crianca_completa WHERE crianca_id = ${id}`
        if (result.length > 0) {
            const row = result[0]
            row.id = row.crianca_id
            return row
        }
        return null
    } catch (error) {
        console.error("Erro ao buscar criança por ID:", error)
        return false
    }
}


module.exports = {
    insertCrianca,
    updateCrianca,
    deleteCrianca,
    selectAllCriancas,
    selectByIdCrianca
}