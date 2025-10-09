// src/routes/routesInstituicao.js
const express = require('express')
const router = express.Router()
const controllerInstituicao = require('../../controllers/instituicao/controllerInstituicao')

router.post(
    '/',
    controllerInstituicao.postInstituicao
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
    '/',
    controllerInstituicao.getSearchAllInstituicao
)

router.get(
    '/:id',
    controllerInstituicao.getSearchInstituicao
)

router.post(
    '/login',
    controllerInstituicao.postLoginInstituicao
)

router.get(
    '', 
    controllerInstituicao.getSearchInstituicoes
)

module.exports = router