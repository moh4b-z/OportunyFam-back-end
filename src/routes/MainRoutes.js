const express = require('express')
const router = express.Router()

const routesSexo = require('./routesSexo')
const routesTipoNivel = require('./routesTipoNivel')
const routesEndereco = require('./routesEndereco')
const routesUsuario = require('./routesUsuario')
const routesInstituicao = require('./routesInstituicao')
const routesCrianca = require('./routesCrianca')

router.use('/sexo', routesSexo)
router.use('/tipoNivel', routesTipoNivel)
router.use('/endereco', routesEndereco)
router.use('/usuario', routesUsuario)
router.use('/instituicao', routesInstituicao)
router.use('/crianca', routesCrianca)

module.exports = router