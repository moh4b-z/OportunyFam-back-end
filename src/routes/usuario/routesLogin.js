// src/routes/routesTipoNivel.js
const express = require('express')
const router = express.Router()
const controllerUsuario = require('../../controllers/usuario/controllerUsuario')

router.post(
    '',
    controllerUsuario.postLoginUniversal
)

module.exports = router