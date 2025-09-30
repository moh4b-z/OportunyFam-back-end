const express = require('express')
const router = express.Router()
const controllerEndereco = require('../../controllers/endereco/controllerEndereco')

router.post(
    '/',
    controllerEndereco.postEndereco
)

router.delete(
    '/:id',
    controllerEndereco.deleteEndereco
)

router.put(
    '/:id',
    controllerEndereco.putEndereco
)

router.get(
    '/',
    controllerEndereco.getSearchAllEndereco
)

router.get(
    '/osm/',
    controllerEndereco.getInstituicoes
)

router.get(
    '/:id',
    controllerEndereco.getSearchEndereco
)

module.exports = router