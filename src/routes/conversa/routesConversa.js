const express = require('express')
const router = express.Router()
const controllerConversa = require('../../controllers/conversa/controllerConversa')
const controllerMensagem = require('../../controllers/conversa/controllerMensagem')

// Conversas
router.post('', controllerConversa.postConversa)
router.put('/:id', controllerConversa.putConversa)
router.delete('/:id', controllerConversa.deleteConversa)
router.get('', controllerConversa.getSearchAllConversas)
router.get('/:id', controllerConversa.getSearchConversa)

// Mensagens relacionadas a conversas (controller separado)
router.post('/mensagens', controllerMensagem.postMensagem)
router.put('/mensagens/:id', controllerMensagem.putMensagem)
router.delete('/mensagens/:id', controllerMensagem.deleteMensagem)
router.get('/mensagens/:id', controllerMensagem.getSearchMensagem)
router.get('/:id/mensagens', controllerMensagem.getMensagensByConversa)

module.exports = router
