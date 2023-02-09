const express  = require('express');
const router = express.Router();

const {registerController,loginController,forgotpasswordController,resetPasswordController} = require("../controllers/authController");
const verifytokenController = require('../controllers/verifytokenController');

//Register API
router.post('/register',registerController);

//Login API
router.post('/login',loginController);

//forgotpassword
router.post('/forgotpassword',forgotpasswordController)

//VerifyToken Controller 
router.get('/verifyToken', verifytokenController);

//reset Password Controller 
router.post('/resetpassword', resetPasswordController);



module.exports = router;