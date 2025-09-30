const express = require('express')
const router = express.Router()
const controllerResponsavel = require('../../controllers/usuario/responsavel/controllerResponsavel')

router.post(
    '/',
    controllerResponsavel.postResponsavel
)

router.delete(
    '/:id',
    controllerResponsavel.deleteResponsavel
)

router.get(
    '/',
    controllerResponsavel.getSearchAllResponsavel
)

router.get(
    '/:id',
    controllerResponsavel.getSearchResponsavel
)

module.exports = router