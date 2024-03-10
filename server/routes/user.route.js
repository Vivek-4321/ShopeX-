const express = require('express');
const { userProfile, userUpdate, userDelete } = require('../controllers/user.controller');
const {userValidateToken} = require('../jwt');
const router = express.Router();

router.post('/userProfile/:id',userValidateToken,userProfile);
router.post('/userProfileUpdate/:id',userValidateToken,userUpdate);
router.post('/userDelete/:id',userValidateToken,userDelete);

module.exports = router;