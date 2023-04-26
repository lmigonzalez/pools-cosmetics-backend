const router = require('express').Router();

const {login, newUser} = require('../controllers/LoginController')


router.post('/create-user', newUser)

router.post('/login', login)

module.exports = router