// src/models/instituicao.js
const { PrismaClient } = require('../../../../prisma/generated/mysql')
const prismaMySQL = new PrismaClient()

async function insertInstituicao(instituicao) {
  try {
    const {
      nome,
      email,
      senha,
      telefone,
      descricao,
      cnpj,
      id_endereco,
      id_sexo,
      logo
    } = instituicao

    // A procedure retorna o ID da instituição criada.
    const result = await prismaMySQL.$queryRawUnsafe(`
      CALL sp_inserir_instituicao(?, ?, ?, ?, ?, ?, ?, ?, ?);
    `, nome, email, senha, telefone, descricao, cnpj, id_endereco, id_sexo, logo)

    // Normalmente o primeiro item do result contém o ID retornado.
    const inserted = result[0] && result[0][0] ? result[0][0] : null

    if (!inserted || !inserted.id_instituicao) return false

    // Retorna a instituição recém-criada pela view completa
    return await selectByIdInstituicao(inserted.id_instituicao)

  } catch (error) {
    console.error("Erro ao inserir instituição:", error)
    return false
  }
}

/**
 * Atualiza uma instituição usando a stored procedure sp_atualizar_instituicao
 */
async function updateInstituicao(instituicao) {
  try {
    const {
      id_instituicao,
      nome,
      email,
      senha,
      telefone,
      descricao,
      cnpj,
      id_endereco,
      logo
    } = instituicao

    await prismaMySQL.$queryRawUnsafe(`
      CALL sp_atualizar_instituicao(?, ?, ?, ?, ?, ?, ?, ?, ?);
    `, id_instituicao, nome, email, senha, telefone, descricao, cnpj, id_endereco, logo)

    return await selectByIdInstituicao(id_instituicao)

  } catch (error) {
    console.error("Erro ao atualizar instituição:", error)
    return false
  }
}

/**
 * Deleta uma instituição pelo ID da pessoa (pai)
 * Isso garante que o ON DELETE CASCADE remova todos os registros relacionados.
 */
async function deleteInstituicao(id_pessoa) {
  try {
    await prismaMySQL.tbl_pessoa.delete({ where: { id: id_pessoa } })
    return true
  } catch (error) {
    console.error("Erro ao deletar instituição (por pessoa):", error)
    return false
  }
}

/**
 * Retorna todas as instituições com base na view completa
 */
async function selectAllInstituicoes() {
  try {
    return await prismaMySQL.$queryRaw`
      SELECT * FROM vw_instituicao_completa
      ORDER BY instituicao_id DESC;
    `
  } catch (error) {
    console.error("Erro ao buscar todas as instituições:", error)
    return false
  }
}

/**
 * Busca instituição pelo ID (usa view completa)
 */
async function selectByIdInstituicao(id_instituicao) {
  try {
    const result = await prismaMySQL.$queryRaw`
      SELECT * FROM vw_instituicao_completa WHERE instituicao_id = ${id_instituicao};
    `
    return result.length > 0 ? result[0] : null
  } catch (error) {
    console.error("Erro ao buscar instituição por ID:", error)
    return false
  }
}


/**
 * Busca instituições pelo nome (usa procedure de busca paginada)
 */
async function selectSearchInstituicoesByNome(nomeBusca, pagina = 1, tamanho = 20) {
  const busca = nomeBusca || null
  const lat = null
  const lng = null
  const raio_km = null

  try {
    const result = await prismaMySQL.$queryRawUnsafe(`
      CALL sp_buscar_instituicoes(?, ?, ?, ?, ?, ?);
    `, busca, lat, lng, raio_km, parseInt(pagina), parseInt(tamanho))

    const instituicoes = result[0] || []
    const totalRegistro = result[1]?.[0]?.total ? parseInt(result[1][0].total) : 0

    return { instituicoes, total: totalRegistro }

  } catch (error) {
    console.error("Erro ao buscar instituições por nome:", error)
    return false
  }
}


module.exports = {
  insertInstituicao,
  updateInstituicao,
  deleteInstituicao,
  selectAllInstituicoes,
  selectByIdInstituicao,
  selectSearchInstituicoesByNome
}