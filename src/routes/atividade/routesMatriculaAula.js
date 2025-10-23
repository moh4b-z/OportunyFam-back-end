const express = require('express')
const router = express.Router()
const controllerMatricula = require('../../controllers/atividade/matriculaAula/controllerMatriculaAula')

router.post(
    '',
    controllerMatricula.postMatriculaAula
)

router.get(
    '/:idInscricao',
    controllerMatricula.getMatriculasByInscricao
)

router.put(
    '/:id',
    controllerMatricula.putMatriculaAula
)

router.delete(
    '/:id',
    controllerMatricula.deleteMatriculaAula
)


module.exports = router