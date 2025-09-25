// src/routes/routesSexo.js
const express = require('express')
const router = express.Router()
const controllerSexo = require('../controllers/sexo/controllerSexo')

router.post(
    '/',
    controllerSexo.postSexo
)

router.delete(
    '/:id',
    controllerSexo.deleteSexo
)

router.put(
    '/:id',
    controllerSexo.putSexo
)

router.get(
    '/',
    controllerSexo.getSearchAllSexo
)

router.get(
    '/:id',
    controllerSexo.getSearchSexo
)

module.exports = router