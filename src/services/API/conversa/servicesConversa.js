const MENSAGE = require('../../../modulo/config')
const CORRECTION = require('../../../utils/inputCheck')
const conversaDAO = require('../../../model/DAO/conversa/conversa')
const pessoaConversaDAO = require('../../../model/DAO/conversa/pessoaConversa/pessoaConversa')
const mensagemDAO = require('../../../model/DAO/conversa/mensagem/mensagem')

async function inserirConversa(dados, contentType) {
    try {
        if (contentType !== 'application/json') return MENSAGE.ERROR_CONTENT_TYPE

        // espera um array de participantes (ids de tbl_pessoa)
        if (!dados.participantes || !Array.isArray(dados.participantes) || dados.participantes.length < 2) return MENSAGE.ERROR_REQUIRED_FIELDS

        // valida participantes
        for (const p of dados.participantes) {
            if (!CORRECTION.CHECK_ID(p)) return MENSAGE.ERROR_REQUIRED_FIELDS
        }

        const created = await conversaDAO.insertConversa()
        if (!created) return MENSAGE.ERROR_INTERNAL_SERVER_MODEL

        // insere participantes
        for (const p of dados.participantes) {
            await pessoaConversaDAO.insertPessoaConversa({ id_conversa: created.id, id_pessoa: p })
        }

        // busca conversa completa
        const participantes = await pessoaConversaDAO.selectByConversa(created.id)
        return { ...MENSAGE.SUCCESS_CEATED_ITEM, conversa: { ...created, participantes } }
    } catch (error) {
        console.error(error)
        return MENSAGE.ERROR_INTERNAL_SERVER_SERVICES
    }
}

async function atualizarConversa(dados, id, contentType) {
    try {
        if (contentType !== 'application/json') return MENSAGE.ERROR_CONTENT_TYPE
        if (!CORRECTION.CHECK_ID(id)) return MENSAGE.ERROR_REQUIRED_FIELDS

        const resultSearch = await buscarConversa(parseInt(id))
        if (resultSearch.status_code === MENSAGE.SUCCESS_REQUEST.status_code) {
            // Se enviar participantes, atualizamos a lista
            if (dados.participantes && Array.isArray(dados.participantes)) {
                for (const p of dados.participantes) if (!CORRECTION.CHECK_ID(p)) return MENSAGE.ERROR_REQUIRED_FIELDS

                // remove antigos e insere novos
                await pessoaConversaDAO.deleteByConversaId(parseInt(id))
                for (const p of dados.participantes) {
                    await pessoaConversaDAO.insertPessoaConversa({ id_conversa: parseInt(id), id_pessoa: p })
                }
            }

            // atualizar registro da conversa (mantido para compatibilidade)
            dados.id = parseInt(id)
            const updated = await conversaDAO.updateConversa(dados)
            const participantes = await pessoaConversaDAO.selectByConversa(parseInt(id))
            return updated ? { ...MENSAGE.SUCCESS_UPDATED_ITEM, conversa: { ...updated, participantes } } : MENSAGE.ERROR_INTERNAL_SERVER_MODEL
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

async function excluirConversa(id) {
    try {
        if (!CORRECTION.CHECK_ID(id)) return MENSAGE.ERROR_REQUIRED_FIELDS

        const resultSearch = await buscarConversa(parseInt(id))
        if (resultSearch.status_code === MENSAGE.SUCCESS_REQUEST.status_code) {
            const result = await conversaDAO.deleteConversa(parseInt(id))
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

async function listarTodasConversas() {
    try {
        const result = await conversaDAO.selectAllConversas()
        if (result) return result.length > 0 ? { ...MENSAGE.SUCCESS_REQUEST, conversas: result } : MENSAGE.ERROR_NOT_FOUND
        return MENSAGE.ERROR_INTERNAL_SERVER_MODEL
    } catch (error) {
        console.error(error)
        return MENSAGE.ERROR_INTERNAL_SERVER_SERVICES
    }
}

async function buscarConversa(id) {
    try {
        if (!CORRECTION.CHECK_ID(id)) return MENSAGE.ERROR_REQUIRED_FIELDS
        const conv = await conversaDAO.selectByIdConversa(parseInt(id))
        if (!conv) return MENSAGE.ERROR_NOT_FOUND

        const participantes = await pessoaConversaDAO.selectByConversa(parseInt(id))
        const mensagens = await mensagemDAO.selectByConversa(parseInt(id))
        return { ...MENSAGE.SUCCESS_REQUEST, conversa: { ...conv, participantes, mensagens } }
    } catch (error) {
        console.error(error)
        return MENSAGE.ERROR_INTERNAL_SERVER_SERVICES
    }
}

async function buscarConversaPorPessoa(id) {
    try {
        if (!CORRECTION.CHECK_ID(id)) return MENSAGE.ERROR_REQUIRED_FIELDS
        const result = await conversaDAO.selectConversasPorPessoa(parseInt(id))
        //console.log(result);
        
        if (!result) return MENSAGE.ERROR_NOT_FOUND
        return { ...MENSAGE.SUCCESS_REQUEST, conversa: result }
    } catch (error) {
        console.error(error)
        return MENSAGE.ERROR_INTERNAL_SERVER_SERVICES
    }
}

module.exports = {
    inserirConversa,
    atualizarConversa,
    excluirConversa,
    listarTodasConversas,
    buscarConversa,
    buscarConversaPorPessoa
}
