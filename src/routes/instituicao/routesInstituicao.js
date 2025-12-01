const express = require('express')
const router = express.Router()
const controllerInstituicao = require('../../controllers/instituicao/controllerInstituicao')
const { cacheMiddleware } = require('../../middleware/cache')

const CACHE_TTL_INSTITUICOES = parseInt(process.env.CACHE_TTL_INSTITUICOES, 10) || 30

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
    '/search', 
    cacheMiddleware(CACHE_TTL_INSTITUICOES),
    controllerInstituicao.getSearchInstituicoesByName
)

router.get(
    '',
    cacheMiddleware(CACHE_TTL_INSTITUICOES),
    controllerInstituicao.getSearchAllInstituicao
)


router.get(
    '/osm/',
    cacheMiddleware(CACHE_TTL_INSTITUICOES),
    controllerInstituicao.getInstituicoesByAddress
)

router.get(
    '/alunos/',
    cacheMiddleware(CACHE_TTL_INSTITUICOES),
    controllerInstituicao.getAlunosInstituicao
)


router.get(
    '/:id',
    cacheMiddleware(CACHE_TTL_INSTITUICOES),
    controllerInstituicao.getSearchInstituicao
)

module.exports = router