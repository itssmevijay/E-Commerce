const session = require('express-session');
const userHelper = require('../helpers/userHelper')
const userModel = require('../models/userSchema')




module.exports = {
    //get home page
    getHomePage:(req,res)=>{
        res.render('user/home',{layout : 'Layout'})
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
            console.log(response,'respooo');             
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
           //Get Shop Page
    getShopPage:(req,res)=>{
        userHelper.getAllProducts().then((shop)=>{
            console.log('1con');
            res.render('user/shop',{layout : 'Layout',shop})
        })
    },
    getProductDetails:(req,res)=>{
        let proId = req.params.id
        userHelper.getProductDetails(proId).then((product)=>{
            console.log(product,'0099');
            res.render('user/productDetails',{layout : 'Layout',product})
        })

    },
}