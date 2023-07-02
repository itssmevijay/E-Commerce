var express = require('express');
var router = express.Router();
var userController = require('../controller/userController')
var cartController = require('../controller/cartController')
var orderController = require('../controller/orderController')
const auth = require('../middleware/auth');



/* GET home page. */
router.get('/', auth.userAuth, userController.getHomePage)

/* GET Login Page. */
router.get('/login', userController.getLoginPage)

/* GET signup page  */
router.get('/signup', userController.getSignupPage)

/* post signup page */
router.post('/signup', userController.postSignup)

/*  Post Login Page */
router.post('/login', userController.dopostLogin)

/* GET LogOut Page. */
router.get('/logout', userController.getLogout)

/* Post Otp Login Page. */
router.post('/otp-login', userController.otpLogin)

// GET SHOP PAGE
router.get('/shop',auth.userAuth, userController.getShopPage)

//otp Verify
router.post('/otp-verify', userController.otpVerify)

router.get('/product-detail/:id', userController.getProductDetails)

/* GET Cart Page */
router.get('/cart-list',auth.userAuth ,cartController.getCart)

/* POST ADD To Cart Page */
router.post('/add-to-cart/:id', cartController.addToCart)

/* POST Update cart quantity Page */
router.patch('/change-product-quantity', cartController.updateQuantity)

/* Delete product from cart*/
router.delete('/delete-product-cart', cartController.deleteProduct)

/* GET User Profile Page */
router.get('/get-profile',auth.userAuth,orderController.getAddress)

/* POST Address Page */
router.route('/add-address').post(orderController.postAddress)

/* GET Check Out Page */
router.get('/check-out', auth.userAuth,orderController.getCheckOut)

/* POST Check Out Page */
router.post('/check-out', orderController.postCheckOut)

router.route('/verify_payment').post(orderController.verifyPayment)

/* GET Edit Address Page */
router.route('/edit-address/:id').get( auth.userAuth,orderController.getEditAddress).patch(orderController.patchEditAddress)

/* DELETE  Address Page */
router.route('/delete-address/:id').delete(orderController.deleteAddress)

/* GET Order Details Page */
router.route('/order-details/:id').get(orderController.orderDetails)

//  post cancel orders
router.route('/cancel-order/').post(orderController.cancelOrder)

// get wishlist
router.route('/wish-list').get(userController.getWishList)

//post wishlist
router.route('/add-to-wishlist').post(userController.addWishList)

//remove from wishlist
router.route('/remove-product-wishlist').delete(userController.removeProductWishlist)

// get contact page
router.get('/about', auth.userAuth,userController.getaboutpage)

// return order

router.route('/return-order/').post(orderController.returnOrder)

//coupon manegmant
router.route('/coupon-verify/:id').get(auth.userAuth, userController.verifyCoupon)

// apply coupon

router.route('/apply-coupon/:id').get(auth.userAuth, userController.applyCoupon)


module.exports = router;