const { PrismaClient } = require('../../../../prisma/generated/mysql')
const prismaMySQL = new PrismaClient()

async function insertInstituicao(instituicao){
    try {
        return await prismaMySQL.tbl_instituicao.create({
            data: {
                nome: instituicao.nome,
                cnpj: instituicao.cnpj,
                email: instituicao.email,
                senha: instituicao.senha,
                descricao: instituicao.descricao
            }
        })
    } catch (error) {
        console.error("Erro ao inserir instituição:", error)
        return false
    }
}

async function updateInstituicao(instituicao){
    try {
        return await prismaMySQL.tbl_instituicao.update({
            where: { id: instituicao.id },
            data: {
                nome: instituicao.nome,
                cnpj: instituicao.cnpj,
                email: instituicao.email,
                senha: instituicao.senha,
                descricao: instituicao.descricao
            }
        })
    } catch (error) {
        console.error("Erro ao atualizar instituição:", error)
        return false
    }
}

async function deleteInstituicao(id){
    try {
        await prismaMySQL.tbl_instituicao.delete({ where: { id: id } })
        return true
    } catch (error) {
        console.error("Erro ao deletar instituição:", error)
        return false
    }
}

async function selectAllInstituicoes(){
    try {
        return await prismaMySQL.$queryRaw`SELECT * FROM vw_instituicao_completa ORDER BY id DESC`
    } catch (error) {
        console.error("Erro ao buscar todas as instituições:", error)
        return false
    }
}

async function selectByIdInstituicao(id){
    try {
        const result = await prismaMySQL.$queryRaw`SELECT * FROM vw_instituicao_completa WHERE id = ${id}`
        return result.length > 0 ? result[0] : null
    } catch (error) {
        console.error("Erro ao buscar instituição por ID:", error)
        return false
    }
}

async function selectByEmail(email){
    try {
        return await prismaMySQL.tbl_instituicao.findUnique({ where: { email: email } })
    } catch (error) {
        console.error("Erro ao buscar instituição por e-mail:", error)
        return false
    }
}

async function selectSearchInstituicoesByNome(nomeBusca, pagina = 1, tamanho = 20) {
    // Define valores padrão para os parâmetros geográficos (NULL)
    const busca = nomeBusca || null
    const lat = null
    const lng = null
    const raio_km = null
    
    // Converte pagina e tamanho para INT (garantindo que são valores seguros)
    const paginaInt = parseInt(pagina)
    const tamanhoInt = parseInt(tamanho)

    try {
        
        // Chamada da Stored Procedure com os 6 parâmetros:
        // p_busca, p_lat, p_lng, p_raio_km, p_pagina, p_tamanho
        const result = await prismaMySQL.$queryRawUnsafe(`
            CALL sp_buscar_instituicoes(?, ?, ?, ?, ?, ?);
        `, busca, lat, lng, raio_km, paginaInt, tamanhoInt)

        // O retorno da SP tem dois result sets: [Instituições], [Total]
        const instituicoes = result[0] || []
        // Extrai o total do segundo result set
        const totalRegistro = result[1] && result[1][0] && result[1][0].total ? parseInt(result[1][0].total) : 0

        return { instituicoes, total: totalRegistro }

    } catch (error) {
        console.error("Erro ao executar sp_buscar_instituicoes:", error)
        return false
    }
}


module.exports = {
    insertInstituicao,
    updateInstituicao,
    deleteInstituicao,
    selectAllInstituicoes,
    selectByIdInstituicao,
    selectByEmail,
    selectSearchInstituicoesByNome
}