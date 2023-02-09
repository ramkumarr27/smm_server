const express  = require('express');
const router = express.Router();

const {verifyEmailController} = require('../controllers/verifyemailController');


//verify email
router.get("/verify",verifyEmailController);


module.exports = router;
