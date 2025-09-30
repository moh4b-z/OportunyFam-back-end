const express = require('express')
const router = express.Router()
const controllerCrianca = require('../../controllers/crianca')

router.post(
    '/',
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
    '/',
    controllerCrianca.getSearchAllCrianca
)

router.get(
    '/:id',
    controllerCrianca.getSearchCrianca
)

router.post(
    '/login',
    controllerCrianca.postLoginCrianca
)

module.exports = router