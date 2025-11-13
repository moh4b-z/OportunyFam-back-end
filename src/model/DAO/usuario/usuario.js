const { PrismaClient } = require('../../../../prisma/generated/client')
const { selectByIdCrianca } = require('../crianca/crianca')
const { selectByIdInstituicao } = require('../instituicao/instituicao')
const prismaMySQL = new PrismaClient()

async function insertUsuario(usuario){
    try {
        // Usa a stored procedure para inserir (insere em tbl_pessoa + tbl_usuario)
        const result = await prismaMySQL.$queryRawUnsafe(`
            CALL sp_inserir_usuario(?, ?, ?, ?, ?, ?, ?, ?, ?);
        `,
        usuario.nome,
        usuario.email,
        usuario.senha,
        usuario.telefone || null,
        usuario.foto_perfil || null,
        usuario.cpf || null,
        usuario.data_nascimento ? new Date(usuario.data_nascimento) : null,
        usuario.id_sexo,
        usuario.id_tipo_nivel)

        const insertedRow = result[0]
        const inserted_id = insertedRow?.usuario_id || insertedRow?.f0
        if (!inserted_id) {
            console.error("A SP de inserção não retornou um ID válido.")
            return false
        }

        // Busca o objeto completo pela view
        const usuarioCompleto = await selectByIdUsuario(inserted_id)
        if (usuarioCompleto) usuarioCompleto.id = usuarioCompleto.usuario_id || inserted_id
        return usuarioCompleto
    } catch (error) {
        console.error("Erro DAO: Erro ao inserir usuário.", error)
        return false
    }
}

async function updateUsuario(usuario){
    try {
        // Atualiza via procedure para manter lógica de tbl_pessoa + tbl_usuario
        const id_usuario = usuario.id
        await prismaMySQL.$queryRawUnsafe(`
            CALL sp_atualizar_usuario(?, ?, ?, ?, ?, ?, ?, ?, ?, ?);
        `,
        id_usuario,
        usuario.nome,
        usuario.email,
        usuario.senha,
        usuario.telefone || null,
        usuario.foto_perfil || null,
        usuario.cpf || null,
        usuario.data_nascimento ? new Date(usuario.data_nascimento) : null,
        usuario.id_sexo,
        usuario.id_tipo_nivel)

        // Retorna usuário atualizado
        const atualizado = await selectByIdUsuario(id_usuario)
        if (atualizado) atualizado.id = atualizado.usuario_id || id_usuario
        return atualizado
    } catch (error) {
        console.error("Erro DAO: Erro ao atualizar usuário.", error)
        return false
    }
}


async function deleteUsuario(id){
    try {
        // Deleta a pessoa relacionada para acionar cascade e remover tudo
        const usuario = await selectByIdUsuario(id)
        if (!usuario) return false
        const pessoa_id = usuario.pessoa_id
        if (!pessoa_id) return false
        await prismaMySQL.tbl_pessoa.delete({ where: { id: pessoa_id } })
        return true
    } catch (error) {
        console.error("Erro DAO: Erro ao deletar usuário.", error)
        return false
    }
}


async function selectAllUsuario(){
    try {
        let result = await prismaMySQL.$queryRaw`SELECT * FROM vw_usuario_completa ORDER BY usuario_id DESC`
        // manter compatibilidade: mapear id = usuario_id para serviços que usam result.id
        return result.map(r => ({ ...r, id: r.usuario_id }))
    } catch (error) {
        console.error("Erro DAO: Erro ao buscar todos os usuários.", error)
        return false
    }
}

async function selectByIdUsuario(id){
    try {
        let result = await prismaMySQL.$queryRaw`SELECT * FROM vw_usuario_completa WHERE usuario_id = ${id}`
        if (result.length > 0) {
            const row = result[0]
            row.id = row.usuario_id
            return row
        }
        return null
    } catch (error) {
        console.error("Erro DAO: Erro ao buscar usuário por ID.", error)
        return false
    }
}


module.exports = {
    insertUsuario,
    updateUsuario,
    deleteUsuario,
    selectAllUsuario,
    selectByIdUsuario
}