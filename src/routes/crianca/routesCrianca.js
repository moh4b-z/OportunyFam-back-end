const express = require('express')
const router = express.Router()
const controllerCrianca = require('../../controllers/crianca/controllerCrianca')

router.post(
    '',
    controllerCrianca.postCrianca
)

router.delete(
    '/:id',
    controllerCrianca.deleteCrianca
)

router.put(
    '/:id',
    controllerCrianca.putCrianca
)

router.get(
    '',
    controllerCrianca.getSearchAllCrianca
)

router.get(
    '/:id',
    controllerCrianca.getSearchCrianca
)

module.exports = router