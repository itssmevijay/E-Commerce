var express = require('express');
var router = express.Router();
var userController = require('../controller/userController')

/* GET home page. */
router.get('/',userController.getHomePage)

/* GET Login Page. */
router.get('/login',userController.getLoginPage)

/* GET signup page  */
router.get('/signup',userController.getSignupPage)

/* post signup page */
router.post('/signup', userController.postSignup)

/*  Post Login Page */
router.post('/login',userController.dopostLogin)

/* GET LogOut Page. */
router.get('/logout',userController.getLogout)

/* Post Otp Login Page. */
router.post('/otp-login', userController.otpLogin)

// GET SHOP PAGE
router.get('/shop',userController.getShopPage)

//otp Verify
router.post('/otp-verify',userController.otpVerify)

router.get('/product-details/:id',userController.getProductDetails)



module.exports = router;