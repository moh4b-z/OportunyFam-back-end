const express = require('express');
const router = express.Router();
const controllerTipoUsuario = require('../controller/tipoUsuario/controllerTipoUsuario');

router.post(
    '',
    controllerTipoUsuario.postTipoUsuario
);

router.delete(
    '/:idTipoUsuario',
    controllerTipoUsuario.deleteTipoUsuario
);

router.put(
    '/:idTipoUsuario',
    controllerTipoUsuario.putTipoUsuario
);

router.get(
    '',
    controllerTipoUsuario.getSearchAllTipoUsuario
);

router.get(
    '/:idTipoUsuario',
    controllerTipoUsuario.getSearchTipoUsuario
);

module.exports = router;
