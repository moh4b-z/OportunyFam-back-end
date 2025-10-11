const express = require('express')
const router = express.Router()
const controllerUsuario = require('../../controllers/usuario/controllerUsuario')

router.post(
    '',
    controllerUsuario.postUsuario
)
router.post(
    '/login',
    controllerUsuario.postLoginUsuario
)

router.delete(
    '/:id',
    controllerUsuario.deleteUsuario
)

router.put(
    '/:id',
    controllerUsuario.putUsuario
)

router.get(
    '',
    controllerUsuario.getSearchAllUsuario
)

router.get(
    '/:id',
    controllerUsuario.getSearchUsuario
)

module.exports = router