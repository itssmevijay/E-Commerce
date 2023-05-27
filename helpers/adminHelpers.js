const adminModel = require("../models/adminSchema")
const userModel = require('../models/userSchema')
const productModel = require("../models/productSchema")
const bcrypt = require('bcrypt')
const categoryModel=require('../models/catagorySchema')

module.exports={

   /* Post Login Page. */
   doLogin: (data) => {
    console.log(data, 'ooo');
    try {
        return new Promise((resolve, reject) => {
            adminModel.Admin.findOne({ email: data.email }).then((admin) => {
                if (admin) {
                    bcrypt.compare(data.password, admin.password).then((loginTrue) => {
                        resolve(loginTrue)
                    })
                } else {
                    resolve(false)
                }
            })
        })
    } catch (error) {
        console.log(error.message);
    }
    },
         /* GET User List Page. */
         getUserList: () => {
            try {
                return new Promise((resolve, reject) => {
                    userModel.user.find().then((user) => {
                        if (user) {
                            resolve(user)
                        } else {
                            console.log("User not found");
                        }
                    })
                })
            } catch (error) {
                console.log(error.message);
            }
        }, //get product list
        getProductList: (req, res) => {
            return new Promise((resolve, reject) => {
                productModel.Product.find()
                    .then((product) => {
                        if (!product) {
                            // If no product is found, reject the promise with an error
                            reject(new Error('No products found.'));
                        } else {
                            console.log(product,"123456");
                            resolve(product);
                        }
                    })
                    .catch((error) => {
                        // Handle any other errors that may occur during the query
                        reject(error);
                    });
            });
        },
  
    /* Post AddProduct Page. */
    postAddProduct: (data) => {
        console.log(data,'dataaaaa');
        try {
            return new Promise((resolve, reject) => {
                let product = new productModel.Product(data);
                product.save().then(() => {
                    resolve()
                })

            })
        } catch (error) {
            console.log(error.message);
        }
    },
    
    /* GET EditProduct Page. */
    getEditProduct: (proId) => {
        try {
            return new Promise((resolve, reject) => {
                productModel.Product.findById(proId).then((product) => {
                    if (product) {
                        resolve(product)
                    } else {
                        console.log('product not found');
                    }
                })
            })
        } catch (error) {
            console.log(error.message);
        }

    },
      //to get images for edit product
      getPreviousImages: (proId) => {
        try {
            return new Promise(async (resolve, reject) => {
                await productModel.Product.findOne({ _id: proId }).then((response) => {
                    resolve(response.img)
                })
            })
        } catch (error) {
            console.log(error.message);
        }

    },
        /* Post EditProduct Page. */
        postEditProduct: (proId, product, image) => {

            try {
                return new Promise((resolve, reject) => {
                    productModel.Product.updateOne({ _id: proId },
                        {
                            $set:
                            {
                                name: product.name,
                                brand: product.brand,
                                description: product.description,
                                price: product.price,
                                quantity: product.quantity,
                                category: product.category,
                                img: image
                            }
                        }).then((newProduct) => {
                            resolve(newProduct)
                        })
                })
            } catch (error) {
                console.log(error.message);
            }
        },
        deleteProduct:(proId)=>{
            console.log(proId);
            return new Promise((resolve,reject)=>{
                productModel.Product.deleteOne({_id : proId}).then((response)=>{
                    if(response){
                        resolve({status : true})
                    }else{
                        resolve({status : false})
                    }
                })
            })
        },

        addCategory:(data)=>{
      
            try{
              return new Promise((resolve,reject)=>{
                categoryModel.Category.findOne({ category: data.category}).then(
                  async (category)=>{
                    if(!category){
                      let category =categoryModel.Category(data);
                      await category.save().then(()=>{
                        resolve({status:true});
                      });
                    }else{
                      if(!category.sub_category.includes(data.sub_category)){
                        categoryModel.Category.updateOne(
                          {category: data.category},
                          {$push:{sub_category: data.sub_category}}
                        ).then(()=>{
                          resolve({status:true});
                        });
                      }else{
                        resolve({status:false})
                      }
                    }
                  }
                )
              })
            }
            catch(error){
              console.log(error.message);
            }
          },

          getEditcategory:async(categoryId)=>{

            try{
            return  await categoryModel.Category.findById(categoryId)
            }catch(error){
              console.log(error.message);
            }
          },
          postEditcategory:(data)=>{
            console.log(data,'dddddddddddddd');
            try{
              return new Promise((resolve,reject)=>{
                categoryModel.Category.findByIdAndUpdate(data._id,{
                  category:data.category
                },{
                  new:true
                }).then((category)=>{
      
                })
              })
            }
            catch(error){
              console.log(error.message);
            }
          },
          deleteCategory:(catId)=>{
            try{
              return new Promise((resolve,reject)=>{
                categoryModel.Category.findByIdAndDelete(catId).then((res)=>{
                  if(res){
                    resolve({status:true})
                  }else{
                    resolve({status:false})
      
                  }
                })
              })
            }catch(error){
              console.log(error.message);
            }
          },
             // Put change user stastus//
    changeUserStatus: (userId, status) => {
        try {
            return new Promise((resolve, reject) => {
                userModel.user.updateOne({ _id: userId }, { $set: { status: status } }).then((response) => {
                    if (response) {
                        resolve(response)
                    } else {
                        console.log("not found");
                    }
                })
            })
        } catch (error) {
            console.log(error.message);
        }

    },
        
   
}