const express = require('express')
const router = express.Router()
const controllerLogin = require('../controllers/controllerLogin')

router.post(
    '',
    controllerLogin.postLoginUniversal
)

module.exports = router