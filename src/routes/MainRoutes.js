const express = require('express')
const router = express.Router()

const routesTipoUsuario = require('./routesTipoUsuario')
const routesSexo = require('./routesSexo')

router.use('/tipoUsuario', routesTipoUsuario)
router.use('/sexo', routesSexo)

module.exports = router