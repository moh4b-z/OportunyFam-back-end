const express = require('express')
const router = express.Router()
const controllerMatricula = require('../../controllers/atividade/matriculaAula/controllerMatriculaAula')

// POST /v1/matriculas - Cria um novo registro de presença em aula
router.post(
    '/',
    controllerMatricula.postMatriculaAula
)

// GET /v1/matriculas/inscricao/:idInscricao - Lista presenças de uma Inscrição
router.get(
    '/inscricao/:idInscricao',
    controllerMatricula.getMatriculasByInscricao
)

// PUT /v1/matriculas/:id - Atualiza um registro de matrícula (Ex: marcar presente/ausente)
router.put(
    '/:id',
    controllerMatricula.putMatriculaAula
)

// DELETE /v1/matriculas/:id - Exclui um registro de matrícula/presença
router.delete(
    '/:id',
    controllerMatricula.deleteMatriculaAula
)


module.exports = router