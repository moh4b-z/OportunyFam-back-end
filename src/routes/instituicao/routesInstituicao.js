// src/routes/routesInstituicao.js
const express = require('express')
const router = express.Router()
const controllerInstituicao = require('../../controllers/instituicao/controllerInstituicao')

router.post(
    '/',
    controllerInstituicao.postInstituicao
)

router.post(
    '/login',
    controllerInstituicao.postLoginInstituicao
)

router.delete(
    '/:id',
    controllerInstituicao.deleteInstituicao
)

router.put(
    '/:id',
    controllerInstituicao.putInstituicao
)

router.get(
    '',
    controllerInstituicao.getSearchAllInstituicao
)

router.get(
    '/', 
    controllerInstituicao.getSearchInstituicoesByName
)

router.get(
    '/:id',
    controllerInstituicao.getSearchInstituicao
)

router.get(
    '/osm/',
    controllerInstituicao.getInstituicoesByAddress
)

module.exports = router