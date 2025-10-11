// src/routes/routesTipoNivel.js
const express = require('express')
const router = express.Router()
const controllerTipoNivel = require('../../controllers/usuario/tipoNivel/controllerTipoNivel')

router.post(
    '',
    controllerTipoNivel.postTipoNivel
)

router.delete(
    '/:id',
    controllerTipoNivel.deleteTipoNivel
)

router.put(
    '/:id',
    controllerTipoNivel.putTipoNivel
)

router.get(
    '',
    controllerTipoNivel.getSearchAllTipoNivel
)

router.get(
    '/:id',
    controllerTipoNivel.getSearchTipoNivel
)

module.exports = router