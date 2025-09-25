const express = require('express')
const router = express.Router()

const routesSexo = require('./routesSexo')
const routesTipoNivel = require('./routesTipoNivel')

router.use('/sexo', routesSexo)
router.use('/tipoNivel', routesTipoNivel)

module.exports = router