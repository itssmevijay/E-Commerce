const express = require('express')
const adminHelper = require('../helpers/adminHelpers')
const productModel = require('../models/productSchema')
const categoryModel=require('../models/catagorySchema')

module.exports = {

    //login
    getLoginPage:(req,res)=>{
        res.render('admin/login',{layout : 'adminLoginLayout'})
        },
        //get Dashboard
    getAdminPage:(req,res)=>{
        res.render('admin/dashboard',{layout : 'adminLayout'})
    },
    
    // Post Login Page. 
    postLogin: (req, res) => {
        let data = req.body;
        adminHelper.doLogin(data).then((loginAction) => {
            req.session.admin = loginAction
            res.send(loginAction)
        })
    },
  // Post Logout Page.
  adminLogout:(req,res)=>{
    
    req.session.admin = null
    res.redirect('/admin/login')
},
        /* GET User List Page. */
        getUserList: (req, res) => {
            let admin = req.session.admin
            adminHelper.getUserList().then((user) => {
                console.log(user,'user..//');
                res.render('admin/userList', { layout: 'adminLayout', user, admin })
            })
        },
             //Get Product List
     getProductList: (req,res)=> {
        adminHelper.getProductList().then((product)=>{
            console.log(product);
            res.render('admin/productList',{layout : 'adminLayout',product})
        })
    }
     ,
     //GET Add Product
     getAddProduct:(req,res)=>{
        res.render('admin/addProduct',{layout : 'adminLayout'})
     },
      /* Post AddProduct Page. */
    postAddProduct: (req, res) => {
        let file = req.files
        const fileName = file.map((file) => {
            return file.filename
        })
        console.log(file,'file');
        const product = req.body
        console.log(product,'pro');
        product.img = fileName
        adminHelper.postAddProduct(product).then(() => {
            res.redirect('/admin/dashboard')
        })
    },
           /* GET EditProduct Page. */
      getEditProduct: (req, res) => {
        let admin = req.session.admin
        let proId = req.params.id;
        console.log('00');
        adminHelper.getEditProduct(proId).then(async (product) => {
            // let category = await categoryModel.Category.find()
            res.render('admin/editProduct', { layout: 'adminLayout', product, admin })
        })

    },
    postEditProduct: async (req, res) => {
        let proId = req.params.id
        let file = req.files
        let image = [];

        let previousImages = await adminHelper.getPreviousImages(proId)

        console.log(previousImages, 'oldimage');
        console.log(file, 'uploaded');


        if (req.files.image1) {
            image.push(req.files.image1[0].filename)
        } else {
            image.push(previousImages[0])
        }

        if (req.files.image2) {
            image.push(req.files.image2[0].filename)
        } else {
            image.push(previousImages[1])
        }
        if (req.files.image3) {
            image.push(req.files.image3[0].filename)
        } else {
            image.push(previousImages[2])
        }
        if (req.files.image4) {
            image.push(req.files.image4[0].filename)
        } else {
            image.push(previousImages[3])
        }

        adminHelper.postEditProduct(proId, req.body, image).then(() => {
            res.redirect('/admin/productList')
        })
    },
    deleteProduct:(req,res)=>{
        let proId = req.params.id
        adminHelper.deleteProduct(proId).then((response)=>{
            console.log(response,'==++==');
            res.send(response)
        })
    },
   // GET ADD CATEGORY
  getAddcategory:async(req,res)=>{
    let admin = req.session.admin
    let categories = await categoryModel.Category.find()
    res.render('admin/addCategory',{layout:"adminLayout",categories,admin})
  },

  // POST ADD CATEGORY
  postAddcategory:(req,res)=>{
    adminHelper.addCategory(req.body).then((response)=>{
      res.redirect('/admin/addCategory')
    })
  },
  // GET EDIT CATEGORY
  getEditcategory:async (req,res)=>{
    let categoryId=req.params.id
  
  const response=await adminHelper.getEditcategory(categoryId)
  console.log(response);
  res.send(response)
  },// POST EDIT CATEGORY
  postEditcategory:async(req,res)=>{
    console.log();
  let data = req.body
  const response= adminHelper.postEditcategory(data).then((response)=>{
    
    console.log(response,'sssssssssssss ');
  })
  res.send(response)
  },
  // DELETE CATEGORY
  deleteCategory:(req,res)=>{
      let catId=req.params.id;
      console.log(catId,'==++_--');
    adminHelper.deleteCategory(catId).then((response)=>{
      res.send(response)
    })
  },

     // Put change user stastus//
     changeUserStatus: (req, res) => {
        let userId = req.query.id
        let status = req.query.status
        if (status === 'false') {
            req.session.user = null
        }
        adminHelper.changeUserStatus(userId, status).then(() => {
            res.send(status)
        })
    },

}


    