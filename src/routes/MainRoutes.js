const express = require('express')
const router = express.Router()

const routesTipoUsuario = require('./routesTipoUsuario')

router.use('/tipoUsuario', routesTipoUsuario)

module.exports = router