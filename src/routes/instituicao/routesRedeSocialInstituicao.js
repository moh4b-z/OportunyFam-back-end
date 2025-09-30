// src/routes/routesRedeSocialInstituicao.js

const express = require('express')
const router = express.Router()
const controllerRedeSocialInstituicao = require('../../controllers/instituicao/redeSocialInstituicao/controllerRedeSocialInstituicao')

router.post(
    '/',
    controllerRedeSocialInstituicao.postRedeSocialInstituicao
)

router.delete(
    '/:id',
    controllerRedeSocialInstituicao.deleteRedeSocialInstituicao
)

router.put(
    '/:id',
    controllerRedeSocialInstituicao.putRedeSocialInstituicao
)

router.get(
    '/',
    controllerRedeSocialInstituicao.getSearchAllRedeSocialInstituicao
)

router.get(
    '/:id',
    controllerRedeSocialInstituicao.getSearchRedeSocialInstituicao
)

module.exports = router