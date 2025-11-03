const express = require('express')
const router = express.Router()
const controllerPublicacao = require('../../controllers/instituicao/publicacaoInstituicao/controllerPublicacaoInstituicao')

router.post('', controllerPublicacao.postPublicacaoInstituicao)

router.delete('/:id', controllerPublicacao.deletePublicacaoInstituicao)

router.put('/:id', controllerPublicacao.putPublicacaoInstituicao)

router.get('', controllerPublicacao.getSearchAllPublicacaoInstituicao)

router.get('/instituicao/:id', controllerPublicacao.getPublicacoesByInstituicao)

router.get('/:id', controllerPublicacao.getSearchPublicacaoInstituicao)

module.exports = router
