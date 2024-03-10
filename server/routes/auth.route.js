const express = require("express");
const { register, verify, login, logout, forgotPassword, resetPassword, googleLogin, googleRegister } = require("../controllers/auth.controller");
const {userValidateToken, userPresentToken} = require('../jwt');
const router = express.Router();

router.post("/register",userPresentToken,register);
router.post("/verify",userPresentToken,verify);
router.post("/login",login);
router.get("/logout",userValidateToken,logout);
router.post('/google-login',googleLogin);
router.post("/google-register", googleRegister);
router.post("/forgot-password/:email",forgotPassword);
router.post("/reset-password", resetPassword)

module.exports = router;