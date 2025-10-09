// src/routes/routesTipoNivel.js
const express = require('express')
const router = express.Router()
const controllerUsuario = require('../../controllers/usuario/controllerUsuario')

router.post(
    '/login',
    controllerUsuario.postLoginUniversal
)

module.exports = router