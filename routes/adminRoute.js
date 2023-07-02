var express = require('express');
var router = express.Router();
const multer = require('../config/multer')
const adminController = require('../controller/admincontroller');
const orderController=require('../controller/orderController')
const auth = require('../middleware/auth');
// Get Login Page
router.get('/',adminController.getLoginPage)


// Get Dashboard

router.get('/dashboard',adminController.getAdminPage)

// get loggin page
router.get('/login', adminController.getLoginPage)

 // Post Login Page. 
 router.post('/login',  adminController.postLogin)

 // logout page

 router.get('/logout', adminController.adminLogout)

 // GET User List Page.
router.get('/userList',adminController.getUserList)

// Get ProductList
router.get('/productList',adminController.getProductList)

//GET Add Product
router.get('/add-product',adminController.getAddProduct)

// Post addProduct Page. 
router.post('/addProduct',multer.uploads, adminController.postAddProduct);

// GET EditProduct Page. 
router.get('/editProduct/:id',adminController.getEditProduct)

// Post EditProduct Page.
router.post('/editProduct/:id',multer.editeduploads,adminController.postEditProduct)

// delete product
router.delete('/deleteProduct/:id',adminController.deleteProduct)
// get category
router.get('/addCategory',adminController.getAddcategory)

// POST ADD CATEGORY
router.post('/addCategory',adminController.postAddCategory)

// GET EDIT CATEGORY
router.get('/edit-category/:id',adminController.getEditcategory)

// patch edit category

router.patch('/edit-category/:id',adminController.postEditcategory)

//delete category

router.delete('/api/delete-category/:id',adminController.deleteCategory)

//GET Sub Category list for Add Product Page
router.route('/getSubcategories').post(adminController.getSubCategory)


// Put change user stastus//
router.put('/change_user_status',adminController.changeUserStatus)


//GET Order List Page
router.route('/order-list/:id').get( adminController.getOrderList)


//orderlist page
router.route('/order-list/:id').get( adminController.getOrderList)

//GET Order Details Page.
router.route('/order-details').get(adminController.getOrderDetails)

/* POST Order Status Page. */
router.route('/change-order-status').post(orderController.changeOrderStatus)


// GET Total Order Details Page
router.route('/total-order-list').get(adminController.getTotalOrders)

//get alluserorders

router.get('/alluserOrders',adminController.getalluserOrders)

// GET Add Coupon Page
router.route('/add-coupon').get(auth.adminAuth,adminController.getAddCoupon).post(adminController.postaddCoupon)

// GET Generate Coupon Code Page
router.route('/generate-coupon-code').get(auth.adminAuth,adminController.generatorCouponCode)

// get coupon list page
router.route('/coupon-list').get(auth.adminAuth,adminController.getCouponList)

//delete coupon page
router.route('/remove-coupon').delete(adminController.removeCoupon)

// get post sales report
router.route('/sales-report').get( auth.adminAuth,adminController.getSalesReport).post(adminController.postSalesReport)

// adding banner
router.route('/add-banner').get(auth.adminAuth,adminController.getAddBanner).post(multer.addBannerupload,adminController.postAddBanner)

 // banner list
router.route('/banner-list').get(auth.adminAuth, adminController.getBannerList)


//delete banner

router.route('/delete-banner/:id').delete(auth.adminAuth,adminController.deleteBanner)







module.exports = router;
