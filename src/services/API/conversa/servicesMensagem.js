const MENSAGE = require('../../../modulo/config')
const CORRECTION = require('../../../utils/inputCheck')
const mensagemDAO = require('../../../model/DAO/conversa/mensagem/mensagem')

async function inserirMensagem(dados, contentType) {
    try {
        if (contentType !== 'application/json') return MENSAGE.ERROR_CONTENT_TYPE
        if (!dados || !dados.descricao || !CORRECTION.CHECK_ID(dados.id_conversa) || !CORRECTION.CHECK_ID(dados.id_pessoa)) return MENSAGE.ERROR_REQUIRED_FIELDS

        // tipo: opcional - valida e normaliza
        const ALLOWED_TYPES = ['TEXTO', 'AUDIO', 'IMAGEM']
        let tipo = dados.tipo ? String(dados.tipo).toUpperCase() : 'TEXTO'
        if (!ALLOWED_TYPES.includes(tipo)) return MENSAGE.ERROR_REQUIRED_FIELDS

        // se tipo é AUDIO, audio_url e audio_duracao são obrigatórios
        if (tipo === 'AUDIO') {
            if (!dados.audio_url || !CORRECTION.CHECK_VARCHAR(dados.audio_url, 400)) return MENSAGE.ERROR_REQUIRED_FIELDS
            const dur = CORRECTION.verificarNumero(dados.audio_duracao)
            if (!dur || dur <= 0) return MENSAGE.ERROR_REQUIRED_FIELDS
        }

        // normaliza os valores antes de inserir
        dados.tipo = tipo
        if (dados.audio_url === undefined) dados.audio_url = null
        if (dados.audio_duracao === undefined) dados.audio_duracao = null

        const result = await mensagemDAO.insertMensagem(dados)
        return result ? { ...MENSAGE.SUCCESS_CEATED_ITEM, mensagem: result } : MENSAGE.ERROR_INTERNAL_SERVER_MODEL
    } catch (error) {
        console.error(error)
        return MENSAGE.ERROR_INTERNAL_SERVER_SERVICES
    }
}

async function atualizarMensagem(dados, id, contentType) {
    try {
        if (contentType !== 'application/json') return MENSAGE.ERROR_CONTENT_TYPE
        if (!CORRECTION.CHECK_ID(id) || !dados) return MENSAGE.ERROR_REQUIRED_FIELDS

        const msgSearch = await buscarMensagem(parseInt(id))
        if (msgSearch.status_code === MENSAGE.SUCCESS_REQUEST.status_code) {
            dados.id = parseInt(id)
            // se for atualizar tipo/áudio, validar
            if (dados.tipo) {
                const ALLOWED_TYPES = ['TEXTO', 'AUDIO', 'IMAGEM']
                const tipo = String(dados.tipo).toUpperCase()
                if (!ALLOWED_TYPES.includes(tipo)) return MENSAGE.ERROR_REQUIRED_FIELDS
                dados.tipo = tipo
                if (tipo === 'AUDIO') {
                    if (!dados.audio_url || !CORRECTION.CHECK_VARCHAR(dados.audio_url, 400)) return MENSAGE.ERROR_REQUIRED_FIELDS
                    const dur = CORRECTION.verificarNumero(dados.audio_duracao)
                    if (!dur || dur <= 0) return MENSAGE.ERROR_REQUIRED_FIELDS
                } else {
                    // quando muda para TEXTO/IMAGEM, remover campos de áudio
                    if (dados.tipo !== 'AUDIO') {
                        dados.audio_url = undefined
                        dados.audio_duracao = undefined
                    }
                }
            }

            const updated = await mensagemDAO.updateMensagem(dados)
            return updated ? { ...MENSAGE.SUCCESS_UPDATED_ITEM, mensagem: updated } : MENSAGE.ERROR_INTERNAL_SERVER_MODEL
        } else if (msgSearch.status_code === MENSAGE.ERROR_NOT_FOUND.status_code) {
            return MENSAGE.ERROR_NOT_FOUND
        } else {
            return MENSAGE.ERROR_INTERNAL_SERVER_SERVICES
        }
    } catch (error) {
        console.error(error)
        return MENSAGE.ERROR_INTERNAL_SERVER_SERVICES
    }
}

async function excluirMensagem(id) {
    try {
        if (!CORRECTION.CHECK_ID(id)) return MENSAGE.ERROR_REQUIRED_FIELDS
        const msgSearch = await buscarMensagem(parseInt(id))
        if (msgSearch.status_code === MENSAGE.SUCCESS_REQUEST.status_code) {
            const result = await mensagemDAO.deleteMensagem(parseInt(id))
            return result ? MENSAGE.SUCCESS_DELETE_ITEM : MENSAGE.ERROR_NOT_DELETE
        } else if (msgSearch.status_code === MENSAGE.ERROR_NOT_FOUND.status_code) {
            return MENSAGE.ERROR_NOT_FOUND
        } else {
            return MENSAGE.ERROR_INTERNAL_SERVER_SERVICES
        }
    } catch (error) {
        console.error(error)
        return MENSAGE.ERROR_INTERNAL_SERVER_SERVICES
    }
}

async function listarMensagensPorConversa(id_conversa) {
    try {
        if (!CORRECTION.CHECK_ID(id_conversa)) return MENSAGE.ERROR_REQUIRED_FIELDS
        const result = await mensagemDAO.selectByConversa(parseInt(id_conversa))
        return result ? (result.length > 0 ? { ...MENSAGE.SUCCESS_REQUEST, mensagens: result } : MENSAGE.ERROR_NOT_FOUND) : MENSAGE.ERROR_INTERNAL_SERVER_MODEL
    } catch (error) {
        console.error(error)
        return MENSAGE.ERROR_INTERNAL_SERVER_SERVICES
    }
}

async function buscarMensagem(id) {
    try {
        if (!CORRECTION.CHECK_ID(id)) return MENSAGE.ERROR_REQUIRED_FIELDS
        const result = await mensagemDAO.selectByIdMensagem(parseInt(id))
        return result ? { ...MENSAGE.SUCCESS_REQUEST, mensagem: result } : MENSAGE.ERROR_NOT_FOUND
    } catch (error) {
        console.error(error)
        return MENSAGE.ERROR_INTERNAL_SERVER_SERVICES
    }
}

module.exports = {
    inserirMensagem,
    atualizarMensagem,
    excluirMensagem,
    listarMensagensPorConversa,
    buscarMensagem
}
