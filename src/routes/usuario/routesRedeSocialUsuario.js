// src/routes/routesRedeSocialUsuario.js

const express = require('express')
const router = express.Router()
const controllerRedeSocialUsuario = require('../../controllers/usuario/redeSocialUsuario/controllerRedeSocialUsuario')

router.post(
    '/',
    controllerRedeSocialUsuario.postRedeSocialUsuario
)

router.delete(
    '/:id',
    controllerRedeSocialUsuario.deleteRedeSocialUsuario
)

router.put(
    '/:id',
    controllerRedeSocialUsuario.putRedeSocialUsuario
)

router.get(
    '/',
    controllerRedeSocialUsuario.getSearchAllRedeSocialUsuario
)

router.get(
    '/:id',
    controllerRedeSocialUsuario.getSearchRedeSocialUsuario
)

module.exports = router