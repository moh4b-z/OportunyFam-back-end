const express = require('express')
const router = express.Router()
const controllerTipoInstituicao = require('../../controllers/instituicao/tipoInstituicao/controllerTipoInstituicao')

router.post(
    '/',
    controllerTipoInstituicao.postTipoInstituicao
)

router.delete(
    '/:id',
    controllerTipoInstituicao.deleteTipoInstituicao
)

router.put(
    '/:id',
    controllerTipoInstituicao.putTipoInstituicao
)

router.get(
    '/',
    controllerTipoInstituicao.getSearchAllTipoInstituicao
)

router.get(
    '/:id',
    controllerTipoInstituicao.getSearchTipoInstituicao
)

module.exports = router