const express = require('express')
const router = express.Router()
const controllerRedeSocial = require('../controllers/redeSocial/controllerRedeSocial')

router.post(
    '/',
    controllerRedeSocial.postRedeSocial
)

router.delete(
    '/:id',
    controllerRedeSocial.deleteRedeSocial
)

router.put(
    '/:id',
    controllerRedeSocial.putRedeSocial
)

router.get(
    '/',
    controllerRedeSocial.getSearchAllRedeSocial
)

router.get(
    '/:id',
    controllerRedeSocial.getSearchRedeSocial
)

module.exports = router