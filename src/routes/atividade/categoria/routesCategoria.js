const express = require('express')
const router = express.Router()
const controllerCategoria = require('../../../controllers/atividade/categoria/controllerCategoria')

router.post(
    '/', 
    controllerCategoria.postCategoria
)

router.put(
    '/categorias/:id', 
    controllerCategoria.putCategoria
)

router.delete(
    '/categorias/:id', 
    controllerCategoria.deleteCategoria
)

router.get(
    '/categorias', 
    controllerCategoria.getSearchAllCategorias
)

router.get(
    '/categorias/:id', 
    controllerCategoria.getSearchCategoria
)

module.exports = router;