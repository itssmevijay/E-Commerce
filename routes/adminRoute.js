var express = require('express');
var router = express.Router();
const multer = require('../config/multer')
const adminController = require('../controller/admincontroller');

// Get Login Page
router.get('/',adminController.getLoginPage)


// Get Dashboard
router.get('/dashboard',adminController.getAdminPage)

// get loggin page
router.get('/login', adminController.getLoginPage)

 /* Post Login Page. */
 router.post('/login',  adminController.postLogin)

 // logout page

 router.get('/logout', adminController.adminLogout)

 /* GET User List Page. */
router.get('/userList',adminController.getUserList)

// Get ProductList
router.get('/productList',adminController.getProductList)

//GET Add Product
router.get('/add-product',adminController.getAddProduct)

/* Post addProduct Page. */
router.post('/addProduct',multer.uploads, adminController.postAddProduct);

/* GET EditProduct Page. */
router.get('/editProduct/:id',adminController.getEditProduct)

/* Post EditProduct Page. */
router.post('/editProduct/:id',multer.editeduploads,adminController.postEditProduct)

// delete product
router.delete('/deleteProduct/:id',adminController.deleteProduct)
// get category
router.get('/addCategory',adminController.getAddcategory)

// POST ADD CATEGORY
router.post('/addCategory',adminController.postAddcategory)

// GET EDIT CATEGORY
router.get('/edit-category/:id',adminController.getEditcategory)

// patch edit category

router.patch('/edit-category/:id',adminController.postEditcategory)

//delete category

router.delete('/api/delete-category/:id',adminController.deleteCategory)


// Put change user stastus//
router.put('/change_user_status',adminController.changeUserStatus)





module.exports = router;
