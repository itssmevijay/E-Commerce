const session = require('express-session');
const userHelper = require('../helpers/userHelper')
const userModel = require('../models/userSchema')
const cartHelpers=require('../helpers/cartHelpers')
 const wishListHelpers = require('../helpers/wishlistHelpers')
 const couponHelpers = require('../helpers/couponHelpers')
 const orderHelpers = require("../helpers/orderHelpers")
 const bannerModel = require('../models/bannerSchema')

const { sendOtpApi, otpVerify } = require('../twilio/twilio')




module.exports = {
    //get home page
    getHomePage:(req,res)=>{
        let user = req.session.user._id
        bannerModel.Banner.find().then((banner)=>{
            res.render('user/home',{layout : 'Layout',user,banner})
        })
    },

    //get about page

    getaboutpage:(req,res)=>{ 
        res.render('user/about',{layout :'Layout'})
    },

    //Get Login Page
    getLoginPage:(req,res)=>{
        res.render('user/login',{layout : 'Layout'})
    },
    // get signupPage
    getSignupPage:(req,res)=>{
        res.render('user/signup',{layout :'Layout'})
    },
    // post signup
    postSignup: (req, res) => {
        let data = req.body
        userHelper.doSignup(data).then((response) => {            
            req.session.user = response.data      
            req.session.loggedIn = true
            res.send(response)
        
        })
    },
    /* Post Login Page. */
    dopostLogin: (req, res) => {
        let data = req.body
        console.log(data,'1');
        userHelper.doLogin(data).then((loginAction) => {
            console.log(loginAction,'[[[[');
            if (loginAction.status) {
                req.session.user = loginAction.user
                req.session.status = true
                res.send(loginAction)
                
            } else {
                res.send(loginAction)
            }
        })
    },
      /* GET LogOut Page. */
      getLogout: (req, res) => {
        req.session.user = null
        res.redirect('/login')
    },
      /* GET Otp Login Page. */
      otpLogin: async (req, res) => {
        const { mobileNumber } = req.body;
        req.session.number = mobileNumber;
        try {
            const user = await userHelper.getUserNumber(mobileNumber);
            if (user.status !== true) {
                return res.status(200).json({ error: true, message: 'Wrong Mobile Number' });
            }
            const status = await sendOtpApi(mobileNumber);
            if (!status) {
                return res.status(200).json({ error: true, message: 'Something went wrong' });
            }
            res.status(200).json({ error: false, message: 'Otp has been send successfully' });
        } catch (error) {
            res.status(500).json({ message: 'Internal server error occured' });
        }
    },
        /* GET Otp verify Page. */
        otpVerify: async (req, res) => {

            const { otp } = req.body;
            
    
            let number = req.session.number
            console.log(otp,req.body,number,'--');
            const user = await userModel.user.findOne({ mobile: number }).lean().exec()
            req.session.user = user;
            console.log(user);
            try {
                const status = await otpVerify(otp, number)
    
                if (!status) {
                    res.status(200).json({ error: false, message: 'Something went wrong' })
                }
                res.status(200).json({ error: false, message: 'Otp has been verified' })
    
            } catch (error) {
                res.status(500).json({ message: 'Internal server error occured' })
            }
        },
    /* GET Shop Page. */
    getShopPage: async (req, res) => {
        try {
            let user = req.session.user   
        console.log('1');
        
            let count = await cartHelpers.getCartCount(user._id)
            console.log('2'); 
            const page = parseInt(req.query?.page) || 1
            console.log('3');
            const perPage = 6
            if (req.query?.search || req.query?.sort || req.query?.filter) {
                console.log('4');
                const { product, currentPage, totalPages, noProductFound } = await userHelper.getQueriesOnShop(req.query)
                console.log('5');
                noProductFound ?
              
                    req.session.noProductFound = noProductFound
                 
                    : req.session.selectedProducts = product
                    // console.log(product, user, count, currentPage, totalPages);
                res.render('user/shop', {  product, user, count,totalPages, currentPage, productResult: req.session.noProductFound })
            } else {
                let currentPage = 1
                const { product, totalPages } = await userHelper.getAllProducts(page, perPage);
                if (product?.length != 0)
                    req.session.noProductFound = false
                    // console.log(product,'prooo');
                    // console.log(product, user, count, totalPages, currentPage)
                res.render('user/shop', {  product, user, count, currentPage,totalPages, productResult: req.session.noProduct })
                req.session.noProductFound = false
            }

        } catch (error) {
            console.log(error)
        }
    },

    // get product details page
    getProductDetails:(req,res)=>{
        let proId = req.params.id
        console.log(proId,'--==-==');
        userHelper.getProductDetails(proId).then((product)=>{
            console.log(product,);
            res.render('user/productDetails',{layout : 'Layout',product})
        })

    },
    // get details
    getDetails: (userId) => {
        try {
            return new Promise((resolve, reject) => {
                userModel.user.findOne({ _id: userId }).then((user) => {
                    resolve(user)
                })
            })
        } catch (error) {
            console.log(error.message);
        }
    },
    // get wishlist

    getWishList: async (req, res) => {
        let user = req.session.user
        let count = await cartHelpers.getCartCount(user._id)
        const wishlistCount = await wishListHelpers.getWishListCount(user._id)
        wishListHelpers.getWishListProducts(user._id).then((wishlistProducts) => {
            console.log(wishlistCount, 'count');
            res.render('user/wishList', { layout: 'Layout', user, count, wishlistProducts, wishlistCount })
        })
    },
// add to wish list
    addWishList: (req, res) => {
        let proId = req.body.proId
        let userId = req.session.user._id
        console.log(proId, '1');
        console.log(userId, '2');
        wishListHelpers.addWishList(userId, proId).then((response) => {
            console.log(response, '3');
            res.send(response)
        })
    },

    // remove from wishlist
    removeProductWishlist: (req, res) => {
        let proId = req.body.proId
        let wishListId = req.body.wishListId
        wishListHelpers.removeProductWishlist(proId, wishListId).then((response) => {
            res.send(response)
        })
    },
// verify coupon
    verifyCoupon: (req, res) => {
        let couponCode = req.params.id
        let userId = req.session.user._id
        couponHelpers.verifyCoupon(userId, couponCode).then((response) => {
            res.send(response)
        })
    },

    // apply coupon
    applyCoupon: async (req, res) => {
        let couponCode = req.params.id
        let userId = req.session.user._id
        let total = await orderHelpers.totalCheckOutAmount(userId)
        couponHelpers.applyCoupon(couponCode, total).then((response) => {
            res.send(response)
        })
    },
}