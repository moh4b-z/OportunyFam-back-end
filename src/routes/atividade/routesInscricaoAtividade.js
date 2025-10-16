const express = require('express')
const router = express.Router()
const controllerInscricao = require('../../controllers/atividade/inscricaoAtividade/controllerInscricaoAtividade')

// POST /v1/inscricoes - Cria uma nova inscrição (Criança em Atividade)
router.post(
    '/',
    controllerInscricao.postInscricao
)

// GET /v1/inscricoes - Lista todas as inscrições
router.get(
    '/',
    controllerInscricao.getSearchAllInscricoes
)

// GET /v1/inscricoes/:id - Busca uma inscrição específica
router.get(
    '/:id',
    controllerInscricao.getSearchInscricao
)

// PUT /v1/inscricoes/:id - Atualiza uma inscrição (Ex: mudança de status)
router.put(
    '/:id',
    controllerInscricao.putInscricao
)

// DELETE /v1/inscricoes/:id - Exclui uma inscrição
router.delete(
    '/:id',
    controllerInscricao.deleteInscricao
)


module.exports = router