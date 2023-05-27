const bcrypt= require('bcrypt')
const userModel = require('../models/userSchema'); 
const productSchema = require('../models/productSchema');
// const user = require('../../models/user');


module.exports={
    // signup

    doSignup:(userData)=>{
        
        let obj = {}

        return new Promise(async(resolve,reject)=>{
            try{
                let email = userData.email;
                let existingUser = await userModel.user.findOne({email:email}).maxTimeMS(30000);
                if(existingUser){
                    resolve({status:false});
                }else{
                    let hashedPassword = await bcrypt.hash(userData.password, 10);
                    let data = await userModel.user({
                        name:userData.name,
                        password:hashedPassword,
                        email:userData.email,
                        mobile:userData.mobile,
                    });
                    // console.log(data,'data');
                    

                    await data.save().then((data)=>{
                        obj.data = data
                        obj.status = true
                        resolve(obj);
                    });

                }
            }
            catch(err){
                throw err;
            }
        }) 
    },
    
    //login

    doLogin:(userData)=>{
      
        console.log(userData,"userdata");
        let response = {};

        return new Promise(async (resolve, reject) => {
            let users = await userModel.user.findOne({email:userData.email})
            console.log("this is user -----", users)
            if(users){
                
                bcrypt.compare(userData.password,users.password).then((status)=>{
                    console.log("this is bcrp dta", status);
                    if(status){
                       console.log("login successfully")
                        response.users = users
                        response.status = true
                        resolve(response)
                    }else{
                        console.log("login falied")
                        resolve({status:false})
                    }
                })
            }else{
                resolve({status:false})
            }
            
        })

     
    },  //to get the user number for otp verification
    getUserNumber: (mobileNumber) => {
        try {
          return new Promise((resolve, reject) => {
            userModel.user.findOne({ mobile: mobileNumber }).then((user) => {
              if (user) {
                resolve({status : true , message : "User found"});
              } else {
                resolve({status : false , message : "User not found"})
              }
            }).catch((error) => {
              reject(error);
            });
          });
        } catch (error) {
          console.log(error.message);
        }
      },
      //to render the shop page
      getAllProducts:(req,res)=>{
        return new Promise((resolve,reject)=>{
            productSchema.Product.find().then((product)=>{
                console.log('helper1');
                if(!product){
                    reject(new Error('No Products Found'))
                }else{
                    console.log('helper2');
                    resolve(product)
                }
            }).catch((error)=>{
                reject(error)
            })
        })
      },
      getProductDetails:(proId)=>{
        return new Promise((resolve,reject)=>{
            productSchema.Product.findById({_id : proId}).then((product)=>{
                if(product){
                    resolve(product)
                }else{
                    console.log('product not found');
                }
            })
        })
      }

}