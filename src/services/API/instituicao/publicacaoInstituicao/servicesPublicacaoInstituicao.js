const MENSAGE = require('../../../../modulo/config')
const CORRECTION = require('../../../../utils/inputCheck')
const TableCORRECTION = require('../../../../utils/tablesCheck')
const publicacaoDAO = require('../../../../model/DAO/instituicao/publicacaoInstituicao/publicacaoInstituicao')
const instituicaoDAO = require('../../../../model/DAO/instituicao/instituicao')

async function inserirPublicacaoInstituicao(dados, contentType) {
    try {
        if (contentType !== 'application/json') return MENSAGE.ERROR_CONTENT_TYPE

        if (!TableCORRECTION.CHECK_tbl_publicacao_instituicao(dados)) return MENSAGE.ERROR_REQUIRED_FIELDS

        // Verifica FK: instituição existe?
        const instituicaoExiste = await instituicaoDAO.selectByIdInstituicao(parseInt(dados.id_instituicao))
        if (!instituicaoExiste) return MENSAGE.ERROR_NOT_FOUND

        const result = await publicacaoDAO.insertPublicacaoInstituicao(dados)
        return result ? { ...MENSAGE.SUCCESS_CEATED_ITEM, publicacao_instituicao: result } : MENSAGE.ERROR_INTERNAL_SERVER_MODEL
    } catch (error) {
        console.error(error)
        return MENSAGE.ERROR_INTERNAL_SERVER_SERVICES
    }
}

async function atualizarPublicacaoInstituicao(dados, id, contentType) {
    try {
        if (contentType !== 'application/json') return MENSAGE.ERROR_CONTENT_TYPE

        if (!CORRECTION.CHECK_ID(id) || !TableCORRECTION.CHECK_tbl_publicacao_instituicao(dados)) return MENSAGE.ERROR_REQUIRED_FIELDS

        let resultSearch = await buscarPublicacaoInstituicao(parseInt(id))
        if (resultSearch.status_code === MENSAGE.SUCCESS_REQUEST.status_code) {
            dados.id = parseInt(id)
            const result = await publicacaoDAO.updatePublicacaoInstituicao(dados)
            return result ? { ...MENSAGE.SUCCESS_UPDATED_ITEM, publicacao_instituicao: result } : MENSAGE.ERROR_INTERNAL_SERVER_MODEL
        } else if (resultSearch.status_code === MENSAGE.ERROR_NOT_FOUND.status_code) {
            return MENSAGE.ERROR_NOT_FOUND
        } else {
            return MENSAGE.ERROR_INTERNAL_SERVER_SERVICES
        }
    } catch (error) {
        console.error(error)
        return MENSAGE.ERROR_INTERNAL_SERVER_SERVICES
    }
}

async function excluirPublicacaoInstituicao(id) {
    try {
        if (!CORRECTION.CHECK_ID(id)) return MENSAGE.ERROR_REQUIRED_FIELDS

        let resultSearch = await buscarPublicacaoInstituicao(parseInt(id))
        if (resultSearch.status_code === MENSAGE.SUCCESS_REQUEST.status_code) {
            const result = await publicacaoDAO.deletePublicacaoInstituicao(parseInt(id))
            return result ? MENSAGE.SUCCESS_DELETE_ITEM : MENSAGE.ERROR_NOT_DELETE
        } else if (resultSearch.status_code === MENSAGE.ERROR_NOT_FOUND.status_code) {
            return MENSAGE.ERROR_NOT_FOUND
        } else {
            return MENSAGE.ERROR_INTERNAL_SERVER_SERVICES
        }
    } catch (error) {
        console.error(error)
        return MENSAGE.ERROR_INTERNAL_SERVER_SERVICES
    }
}

async function listarTodasPublicacoesInstituicao() {
    try {
        let result = await publicacaoDAO.selectAllPublicacoesInstituicao()
        if (result) return result.length > 0 ? { ...MENSAGE.SUCCESS_REQUEST, publicacoes_instituicao: result } : MENSAGE.ERROR_NOT_FOUND
        return MENSAGE.ERROR_INTERNAL_SERVER_MODEL
    } catch (error) {
        console.error(error)
        return MENSAGE.ERROR_INTERNAL_SERVER_SERVICES
    }
}

async function buscarPublicacaoInstituicao(id) {
    try {
        if (!CORRECTION.CHECK_ID(id)) return MENSAGE.ERROR_REQUIRED_FIELDS
        let result = await publicacaoDAO.selectByIdPublicacaoInstituicao(parseInt(id))
        return result ? { ...MENSAGE.SUCCESS_REQUEST, publicacao_instituicao: result } : MENSAGE.ERROR_NOT_FOUND
    } catch (error) {
        console.error(error)
        return MENSAGE.ERROR_INTERNAL_SERVER_SERVICES
    }
}

async function listarPorInstituicao(id_instituicao) {
    try {
        if (!CORRECTION.CHECK_ID(id_instituicao)) return MENSAGE.ERROR_REQUIRED_FIELDS
        let result = await publicacaoDAO.selectByInstituicao(parseInt(id_instituicao))
        return result ? (result.length > 0 ? { ...MENSAGE.SUCCESS_REQUEST, publicacoes_instituicao: result } : MENSAGE.ERROR_NOT_FOUND) : MENSAGE.ERROR_INTERNAL_SERVER_MODEL
    } catch (error) {
        console.error(error)
        return MENSAGE.ERROR_INTERNAL_SERVER_SERVICES
    }
}

module.exports = {
    inserirPublicacaoInstituicao,
    atualizarPublicacaoInstituicao,
    excluirPublicacaoInstituicao,
    listarTodasPublicacoesInstituicao,
    buscarPublicacaoInstituicao,
    listarPorInstituicao
}
