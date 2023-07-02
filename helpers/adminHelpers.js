const adminModel = require("../models/adminSchema")
const userModel = require('../models/userSchema')
const productModel = require("../models/productSchema")
const bcrypt = require('bcrypt')
const categoryModel=require('../models/catagorySchema')
const orderModel = require('../models/orderSchema')
const bannerModel= require('../models/bannerSchema')

module.exports={

   /* Post Login Page. */
   doLogin: (data) => {const express = require('express')
const adminHelper = require('../helpers/adminHelpers')
const productModel = require('../models/productSchema')
const categoryModel=require('../models/catagorySchema')
const orderHelpers = require('../helpers/orderHelpers')
const userController = require('../controller/userController')

const userModel= require('../models/userSchema')
const adminHelpers = require('../helpers/adminHelpers')
const orderSchema = require('../models/orderSchema')
const couponHelpers= require('../helpers/couponHelpers')

module.exports = {

    //  dashbord

    getAdminPage: async (req, res) => {
        console.log('called');
        admin = req.session.admin;
        let totalProducts,
            days = [];
        let ordersPerDay = {};
        let paymentCount = [];
    
        let Products = await adminHelpers.getAllProducts();
        totalProducts = Products.length;
    
        // Filter variables for month and year
        let selectedMonth = req.query.month; // Assuming the month is passed as a query parameter
        let selectedYear = req.query.year; // Assuming the year is passed as a query parameter
    
        await orderHelpers.getOrderByDate().then((response) => {
            let result = response;
            for (let i = 0; i < result.length; i++) {
                for (let j = 0; j < result[i].orders.length; j++) {
                    let orderDate = result[i].orders[j].createdAt;
                    let orderMonth = orderDate.getMonth() + 1; // Get month value (0-11), so add 1
                    let orderYear = orderDate.getFullYear();
    
                    // Apply filter for selected month and year
                    if (
                        (!selectedMonth || selectedMonth == orderMonth) &&
                        (!selectedYear || selectedYear == orderYear)
                    ) {
                        let ans = {};
                        ans["createdAt"] = orderDate;
                        days.push(ans);
                    }
                }
            }
    
            days.forEach((order) => {
                let day = order.createdAt.toLocaleDateString("en-US", {
                    weekday: "long",
                });
                ordersPerDay[day] = (ordersPerDay[day] || 0) + 1;
            });
        });
    

        let getCodCount = await adminHelpers.getCodCount();
        let codCount = getCodCount.length;

        let getOnlineCount = await adminHelpers.getOnlineCount();
        let onlineCount = getOnlineCount.length;

        let getWalletCount = await adminHelpers.getWalletCount();
        let WalletCount = getWalletCount.length;

        paymentCount.push(onlineCount);
        paymentCount.push(codCount);
        paymentCount.push(WalletCount);

        let orderByCategory = await orderHelpers.getOrderByCategory()


        let Men = 0, Women = 0, Kids = 0;

        orderByCategory.forEach((order) => {
            order.forEach((product) => {
                if (product.category === 'Men') Men += product.quantity;
                else if (product.category === 'Women') Women += product.quantity;
                else if (product.category === 'Kids') Kids += product.quantity;
            });
        });

        let category = [Men, Women, Kids];

        orderHelpers.getAllOrders().then((response) => {

            let length = response;

            orderHelpers.getAllOrdersSum().then((response) => {
                let total = response
                console.log(total,'totalll');
                res.render('admin/dashboard', {
                    layout: "adminLayout",
                    admin,
                    length,
                    total,
                    totalProducts,
                    ordersPerDay,
                    paymentCount,
                    category
                })
            });
        });
    },


    //login
    getLoginPage:(req,res)=>{
        res.render('admin/login',{layout : 'adminLoginLayout'})
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
 getAddProduct:async (req,res)=>{
        let categories = await categoryModel.Category.find()
        res.render('admin/addProduct',{layout : 'adminLayout',categories})
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
     // post edit product
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

    // delete product
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

 /* Post addCategory Page. */
 postAddCategory: (req, res) => {
    let data = req.body
    adminHelper.addCategory(data).then((category) => {
        res.send(category)
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
            console.log(status,'statt');
            res.send({user : status})
        })
    },

     /* GET ProductList Page. */
     getProductList: (req, res) => {
        let admin = req.session.admin
        adminHelper.getProductList().then((product) => {
            // console.log(Product);
            res.render('admin/productList', { layout: 'adminLayout', product, admin })
        })
    },

    /* GET Order List Page. */
    getOrderList: (req, res) => {
        let userId = req.params.id
        let admin = req.session.admin
        
        adminHelper.getUserList(userId).then((user) => {
            orderHelpers.getOrders(userId).then((response) => {
                let order = response?.orders
                function sortByCreatedAt(a, b) {
                    return new Date(b.createdAt) - new Date(a.createdAt);
                }
                order?.sort(sortByCreatedAt)
                res.render('admin/orderList', { layout: 'adminLayout', user, userId, admin, order })
            })
        })
    
    },

     /* GET Sub Category list for Add Product Page. */
     getSubCategory: (req, res) => {
        let data = req.body
        adminHelper.getSubCategory(data).then((subCategory) => {
            res.send(subCategory)
        })
    },

      /* GET Order Details Page. */
      getOrderDetails: async (req, res) => {
        let admin = req.session.admin
        let orderId = req.query.orderId
        let userId = req.query.userId
        let userDetails = await userController.getDetails(userId)
        orderHelpers.getOrderAddress(userId, orderId).then((address) => {
            orderHelpers.getSubOrders(orderId, userId).then((orderDetails) => {
                orderHelpers.getOrderedProducts(orderId, userId).then((product) => {
                    orderHelpers.getTotal(orderId, userId).then((productTotalPrice) => {
                        orderHelpers.getOrderTotal(orderId, userId).then((orderTotalPrice) => {
                           
                            res.render('admin/orderDetails', {
                                layout: 'adminLayout', admin, userDetails,
                                address, product, orderId, orderDetails, productTotalPrice, orderTotalPrice
                            })
                        })
                    })
                })
            })
        })
    },
    // get total orders
    
    getTotalOrders:(req,res)=>{
        return new Promise((resolve,reject)=>{
            userId = req.session.user._id
            try {
                orderSchema.order.find().then((order)=>{
                    console.log(order[0].orders[0].shippingAddress,'orrr');
                    res.render('admin/totalOrderList',{layout : 'adminLayout',order,userId})
                    
                })
            } catch (error) {
                console.log(error.message);
            }
        })
    },

  // get all user orders

  getalluserOrders: (req, res) => {
    let admin = req.session.admin
    adminHelper.getUserList().then((user) => {
        console.log(user,'user..//');
        res.render('admin/alluserOrders', { layout: 'adminLayout', user, admin })
    })
},
     /* GET Add Coupon Page. */
     getAddCoupon: (req, res) => {
        let admin = req.session.admin
        res.render('admin/addCoupon', { layout: 'adminLayout', admin })
    },

    /* GET Generate Coupon Code Page. */
    generatorCouponCode: (req, res) => {
        console.log('came');
        couponHelpers.generatorCouponCode().then((couponCode) => {
            console.log(couponCode, '-----');
            res.send(couponCode)
        })
    },

        /* Post Add Coupone Page. */
        postaddCoupon: (req, res) => {
            let data = {
                couponCode: req.body.coupon,
                validity: req.body.validity,
                minPurchase: req.body.minPurchase,
                minDiscountPercentage: req.body.minDiscountPercentage,
                maxDiscountValue: req.body.maxDiscount,
                description: req.body.description
            }
            couponHelpers.postaddCoupon(data).then((response) => {
                res.send(response)
            })
        },
         /* GET Coupon List Page. */
    getCouponList: (req, res) => {
        let admin = req.session.admin
        couponHelpers.getCouponList().then((couponList) => {
            res.render('admin/couponList', { layout: 'adminLayout', admin, couponList })
        })
    },

    
    /* DELETE Coupon  Page. */
    removeCoupon: (req, res) => {
        let couponId = req.body.couponId
        couponHelpers.removeCoupon(couponId).then((successResponse) => {
            res.send(successResponse)
        })
    },

      /* GET Sales Report Page. */
      getSalesReport: async (req, res) => {
        let admin = req.session.admin
        let report = await adminHelpers.getSalesReport()
        let details = []
        const getDate = (date) => {
            let orderDate = new Date(date)
            let day = orderDate.getDate()
            let month = orderDate.getMonth() + 1
            let year = orderDate.getFullYear()
            return `${isNaN(day) ? "00" : day} - ${isNaN(month) ? "00" : month} - ${isNaN(year) ? "0000" : year}`
        }

        report.forEach((orders) => {
            details.push(orders.orders)
        })

        res.render("admin/salesReport", { layout: 'adminLayout', admin, details, getDate })
    },


    postSalesReport: async (req, res) => {
        try {
          let admin = req.session.admin;
          let details = [];
          const getDate = (date) => {
            let orderDate = new Date(date);
            let day = orderDate.getDate();
            let month = orderDate.getMonth() + 1;
            let year = orderDate.getFullYear();
            return `${isNaN(day) ? "00" : day} - ${isNaN(month) ? "00" : month} - ${isNaN(year) ? "0000" : year}`;
          };
      
          const orderData = await adminHelpers.postReport(req.body);
          orderData.forEach((orders) => {
            details.push(orders.orders);
          });
      
          res.render("admin/salesReport", { layout: 'adminLayout', admin, details, getDate });
        } catch (error) {
          res.status(500).send(error.message);
        }
      }
    ,  

    // get add banner page
    getAddBanner: async (req, res) => {
        try {
          let admin = req.session.admin;
          res.render('admin/addBanner', { layout: 'adminLayout', admin });
        } catch (error) {
          res.status(500).send(error.message);
        }
      },
      // post addbanner
      postAddBanner: async (req, res) => {
        try {
          console.log(req.body, 'reqbody');
          console.log(req.file.filename, 'files');
      
          const response = await adminHelpers.addBanner(req.body, req.file.filename);
          if (response) {
            console.log(response, '000');
            res.send({ status: true });
          } else {
            res.send({ status: false });
          }
        } catch (error) {
          res.status(500).send(error.message);
        }
      }
      ,

    // get banner list 
    getBannerList: (req, res) => {
        try{
        let admin = req.session.admin
        adminHelpers.getBannerList().then((banner) => {
            console.log(banner, 'banner');

            res.render('admin/bannerList', { layout: 'adminLayout', admin, banner })
        })  }
        catch{
            res.status(500).send(error.message)
        }
    },

  
// delete banner
    
    deleteBanner: async (req, res) => {
        try {
          const response = await adminHelpers.deleteBanner(req.params.id);
          res.send(response);
        } catch (error) {
          res.status(500).send(error.message);
        }
      }
      
    
  }



    
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
        }, 
        //get product list
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

          /* Post addCategory Page. */
    addCategory: (data) => {
      console.log(data, 'dataa');
      try {
          return new Promise((resolve, reject) => {
              // capitalize the first letter of category
              const category = data.category.charAt(0).toUpperCase() + data.category.slice(1).toLowerCase();

              categoryModel.Category.findOne({ category: category })
                  .then(async (categoryDoc) => {
                      if (!categoryDoc) {
                          let newCategory = new categoryModel.Category({
                              category: category,
                              sub_category: [{ name: data.sub_category, offer: { validFrom: 0, validTo: 0, discountPercentage: 0 } }]
                          });
                          await newCategory.save().then(() => {
                              resolve({ status: true });
                          });
                      } else {
                          let subcategoryDoc = categoryDoc.sub_category.find((sub_category) => sub_category.name === data.sub_category);
                          if (!subcategoryDoc) {
                              categoryDoc.sub_category.push({ name: data.sub_category, offer: { validFrom: 0, validTo: 0, discountPercentage: 0 } });
                              await categoryDoc.save().then(() => {
                                  resolve({ status: true });
                              });
                          } else {
                              resolve({ status: false, message: 'Subcategory already exists.' });
                          }
                      }
                  });
          });
      } catch (error) {
          console.log(error.message);
      }
  },
  // get edit catogory page
          getEditcategory:async(categoryId)=>{

            try{
            return  await categoryModel.Category.findById(categoryId)
            }catch(error){
              console.log(error.message);
            }
          },

           // post edit category
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

          // delete category
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

       /* GET Sub Category list for Add Product Page. */
       getSubCategory:(data)=>{
        try {
            return new Promise((resolve,reject)=>{
                categoryModel.Category.findOne({category : data.category}).then((category)=>{
                    if(category){
                        resolve(category.sub_category)
                    }else{
                        reject("Error Category not found")
                    }
                })
            })
        } catch (error) {
            console.log(error.message);
        }
    },
      

      //dashboard codes
  
  getAllProducts: () => {
    return new Promise(async (resolve, reject) => {
      await productModel.Product.find().then((response) => {
        resolve(response);
      });
    });
  },


  getCodCount: () => {
    return new Promise(async (resolve, reject) => {
      let response = await orderModel.order.aggregate([
        {
          $unwind: "$orders",
        },
        {
          $match: {
            "orders.paymentMethod": "COD",
          },
        },
      ]);
      resolve(response);
    });
  },

  getOnlineCount: () => {
    return new Promise(async (resolve, reject) => {
      let response = await orderModel.order.aggregate([
        {
          $unwind: "$orders",
        },
        {
          $match: {
            "orders.paymentMethod": "razorpay",
          },
        },
      ]);
      resolve(response);
    });
  },
// get wushlist count
  getWalletCount:()=>
  {
    return new Promise(async (resolve, reject) => {
      let response = await orderModel.order.aggregate([
        {
          $unwind: "$orders",
        },
        {
          $match: {
            "orders.paymentMethod": "wallet",
          },
        },
      ]);
      resolve(response);
    });

  },
  // get sales report
  getSalesReport: () => {
    try {
        return new Promise((resolve, reject) => {
            orderModel.order.aggregate([
                {
                    $unwind: '$orders'
                },
                {
                    $match: {
                        "orders.orderConfirm": "delivered"
                    }
                }
            ]).then((response) => {
                resolve(response)
            })
        })
    } catch (error) {
        console.log(error.message);
    }
},
postReport: (date) => {
  
  try {
      let start = new Date(date.startdate);
      let end = new Date(date.enddate);
      return new Promise((resolve, reject) => {
          orderModel.order.aggregate([
              {
                  $unwind: '$orders'
              },
              {
                  $match: {
                      $and: [
                          { "orders.orderConfirm": "delivered" },
                          { "orders.createdAt": { $gte: start, $lte: new Date(end.getTime() + 86400000) } }
                      ]
                  }
              }
          ]).exec()
              .then((response) => {
                  console.log(response,'res');
                  resolve(response)
              })
      })
  } catch (error) {
      console.log(error.message);
  }
},
//add banner 
addBanner: (texts, Image) => {
  console.log(texts,'textt');

  return new Promise(async (resolve, reject) => {

    let banner = bannerModel.Banner({
      title: texts.title,
      mainDescription: texts.mainDescription,
      subDescription: texts.subDescription,
      // categoryOffer: texts.categoryOffer,
      link : texts.link,
      image: Image

    })
    await banner.save().then((response) => {
      resolve(response)
    })
  })
},

// get bannerlist
getBannerList:()=>{
  return new Promise((resolve,reject)=>{
   bannerModel.Banner.find().then((banner)=>{
       resolve(banner)
   })
  })
 },

 
 getEditBanner:(bannerId)=>{
  return new Promise((resolve,reject)=>{
      bannerModel.Banner.findOne({_id : bannerId}).then((bannerFound)=>{
      resolve(bannerFound)
      })
  })
},

postEditBanner: (bannerId, text, image1) => {
    return new Promise((resolve, reject) => {
        bannerModel.Banner.updateOne(
            {_id: bannerId},
            {
                $set: {
                    title: text.title,
                    mainDescription: text.mainDescription,
                    subDescription: text.subDescription,
                    categoryOffer: text.categoryOffer,
                    link: text.link,
                    image: image1
                }
            }
        ).then((bannerUpdated) => {
            resolve(bannerUpdated);
        });
    });
},


// delete  banner
deleteBanner:(bannerId)=>{
    return new Promise((resolve,reject)=>{
        bannerModel.Banner.deleteOne({_id : bannerId}).then(()=>{
            resolve()
        })
    })
  }
}