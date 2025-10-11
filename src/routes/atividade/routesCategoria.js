const express = require('express')
const router = express.Router()
const controllerCategoria = require('../../controllers/atividade/categoria/controllerCategoria')

router.post(
    '', 
    controllerCategoria.postCategoria
)

router.put(
    '/:id', 
    controllerCategoria.putCategoria
)

router.delete(
    '/:id', 
    controllerCategoria.deleteCategoria
)

router.get(
    '', 
    controllerCategoria.getSearchAllCategorias
)

router.get(
    '/:id', 
    controllerCategoria.getSearchCategoria
)

module.exports = router;