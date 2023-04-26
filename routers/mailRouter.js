const router = require('express').Router();

const {handleMail} = require('../controllers/MailController')


router.post('/send-message', handleMail)

module.exports = router