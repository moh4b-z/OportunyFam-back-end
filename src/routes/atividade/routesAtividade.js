const express = require('express')
const router = express.Router()
const controllerAtividade = require('../../controllers/atividade/controllerAtividade')
const { cacheMiddleware } = require('../../middleware/cache')

const CACHE_TTL_ATIVIDADES = parseInt(process.env.CACHE_TTL_ATIVIDADES, 10) || 15



router.post(
    '/aulas', 
    controllerAtividade.postAula
) 

router.post(
    '/aulas/lote',
    controllerAtividade.postAulasLote
)

router.put(
    '/aulas/:id', 
    controllerAtividade.putAula
)

router.delete(
    '/aulas/:id', 
    controllerAtividade.deleteAula
)

router.get(
    '/aulas', 
    cacheMiddleware(CACHE_TTL_ATIVIDADES),
    controllerAtividade.getSearchAllAulas
)

router.get(
    '/aulas/:id', 
    cacheMiddleware(CACHE_TTL_ATIVIDADES),
    controllerAtividade.getSearchAula
)

router.get(
    '/aulas/instituicao/:idInstituicao', 
    cacheMiddleware(CACHE_TTL_ATIVIDADES),
    controllerAtividade.getSearchAulasByInstituicao
)

router.post(
    '', 
    controllerAtividade.postAtividade
) 

router.put(
    '/:id', 
    controllerAtividade.putAtividade
)

router.delete(
    '/:id', 
    controllerAtividade.deleteAtividade
)

router.get(
    '', 
    cacheMiddleware(CACHE_TTL_ATIVIDADES),
    controllerAtividade.getSearchAllAtividades
)

router.get(
    '/:id', 
    cacheMiddleware(CACHE_TTL_ATIVIDADES),
    controllerAtividade.getSearchAtividade
)
router.get(
    '/instituicao/:idInstituicao', 
    cacheMiddleware(CACHE_TTL_ATIVIDADES),
    controllerAtividade.getSearchAtividadesByInstituicao
)




module.exports = router