const express = require('express')
const router = express.Router()
const controllerAtividade = require('../../controllers/atividade/controllerAtividade')

router.post(
    '/', 
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
    '/', 
    controllerAtividade.getSearchAllAtividades
)

router.get(
    '/:id', 
    controllerAtividade.getSearchAtividade
)



router.post(
    '/aulas/', 
    controllerAtividade.postAula
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
    '/aulas/:id', 
    controllerAtividade.getSearchAula
)

router.get(
    '/aulas', 
    controllerAtividade.getSearchAllAulas
)

router.get(
    '/aulas/instituicao/:idInstituicao', 
    controllerAtividade.getSearchAulasByInstituicao
)

module.exports = router