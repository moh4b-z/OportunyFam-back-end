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
    '',
    controllerInstituicao.getSearchAllInstituicao
)


router.get(
    '/osm/',
    controllerInstituicao.getInstituicoesByAddress
)

router.get(
    '/alunos/',
    controllerInstituicao.getAlunosInstituicao
)

router.get(
    '/', 
    controllerInstituicao.getSearchInstituicoesByName
)

router.get(
    '/:id',
    controllerInstituicao.getSearchInstituicao
)

module.exports = router