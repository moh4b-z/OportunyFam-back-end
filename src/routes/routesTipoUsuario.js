const express = require('express');
const router = express.Router();
const controllerTipoUsuario = require('../controller/tipoUsuario/controllerTipoUsuario');

router.post(
    '',
    controllerTipoUsuario.postTipoUsuario
);

router.delete(
    '/:id',
    controllerTipoUsuario.deleteTipoUsuario
);

router.put(
    '/:id',
    controllerTipoUsuario.putTipoUsuario
);

router.get(
    '',
    controllerTipoUsuario.getSearchAllTipoUsuario
);

router.get(
    '/:id',
    controllerTipoUsuario.getSearchTipoUsuario
);

module.exports = router;
