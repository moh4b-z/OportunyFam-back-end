const express = require('express')
const router = express.Router()
const controllerInscricao = require('../../controllers/atividade/inscricaoAtividade/controllerInscricaoAtividade')

router.post(
    '',
    controllerInscricao.postInscricao
)

router.get(
    '',
    controllerInscricao.getSearchAllInscricoes
)

router.get(
    '/:id',
    controllerInscricao.getSearchInscricao
)

router.put(
    '/:id',
    controllerInscricao.putInscricao
)

router.delete(
    '/:id',
    controllerInscricao.deleteInscricao
)


module.exports = router