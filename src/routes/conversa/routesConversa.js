const express = require('express')
const router = express.Router()
const controllerConversa = require('../../controllers/conversa/controllerConversa')
const controllerMensagem = require('../../controllers/conversa/controllerMensagem')
const { cacheMiddleware } = require('../../middleware/cache')

const CACHE_TTL_MENSAGENS = parseInt(process.env.CACHE_TTL_MENSAGENS, 10) || 5

// Conversas
router.post('', controllerConversa.postConversa)
router.put('/:id', controllerConversa.putConversa)
router.delete('/:id', controllerConversa.deleteConversa)
router.get('', cacheMiddleware(CACHE_TTL_MENSAGENS), controllerConversa.getSearchAllConversas)
router.get('/pessoa/:id', cacheMiddleware(CACHE_TTL_MENSAGENS), controllerConversa.getSearchConversaByPessoa)
router.get('/:id', cacheMiddleware(CACHE_TTL_MENSAGENS), controllerConversa.getSearchConversa)

// Mensagens relacionadas a conversas (controller separado)
router.post('/mensagens', controllerMensagem.postMensagem)
router.put('/mensagens/:id', controllerMensagem.putMensagem)
router.delete('/mensagens/:id', controllerMensagem.deleteMensagem)
router.get('/mensagens/:id', cacheMiddleware(CACHE_TTL_MENSAGENS), controllerMensagem.getSearchMensagem)
router.get('/:id/mensagens', cacheMiddleware(CACHE_TTL_MENSAGENS), controllerMensagem.getMensagensByConversa)

module.exports = router
