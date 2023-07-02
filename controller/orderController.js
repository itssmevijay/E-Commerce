
const express = require('express')
const { ObjectId } = require('mongodb');
const cartHelpers = require('../helpers/cartHelpers')
const userHelper = require('../helpers/userHelper')
const orderHelpers = require('../helpers/orderHelpers')

module.exports = {

    /* GET Address Page */
    getAddress: async (req, res) => {
        var count = null
        let user = req.session.user
        if (user) {
            var count = await cartHelpers.getCartCount(user._id)

            let userData = await userHelper.getUser(user._id)
            let address = await orderHelpers.getAddress(user._id)
            let orders = await orderHelpers.getOrders(user._id)
            // let product = await orderHelpers.getProduct()
            console.log(user,'user');
            console.log(userData,'userData');
            console.log(count,'count');
            console.log(address,'address');
            console.log(orders,'orders');
            res.render('user/profile', { layout: 'Layout', user, userData, count, address, orders, })
        }

    },

    /* POST Address Page */
    postAddress: (req, res) => {
        let data = req.body
        console.log(data, '00');
        let userId = req.session.user._id
        orderHelpers.postAddress(data, userId).then((response) => {
            res.send(response)
        })
    },


    /* GET Check Out Page */
    getCheckOut: async (req, res) => {
        let userId = req.session.user._id
        let user = req.session.user
        let total = await orderHelpers.totalCheckOutAmount(userId)
        let count = await cartHelpers.getCartCount(userId)
        let address = await orderHelpers.getAddress(userId)
        cartHelpers.getCartItems(userId).then((cartItems) => {
            console.log(user,'user');
            console.log(cartItems,'cart');
            console.log(total,'totall');
            console.log(count,'count');
            console.log(address,'address');
            res.render('user/checkOut', { layout: 'Layout', user, cartItems,total, count, address })
        })
    },

    /* POST Check Out Page */
    postCheckOut: async (req, res) => {
        try {
            let userId = req.session.user._id
            let data = req.body;
            let total = data.discountedAmount
            console.log(data, 'lolol');
            try {
                const response = await orderHelpers.placeOrder(data);
                console.log(response, 'response');
                if (data.payment_option === "COD") {
                    res.json({ codStatus: true });
                } else if (data.payment_option === "razorpay") {
                    await orderHelpers
                        .generateRazorpay(req.session.user._id, total)
                        .then((order) => {
                            res.json(order);
                        });
                }
            } catch (error) {
                res.json({ status: false, error: error.message })
            }
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: error.message });
        }
    },

    /* GET Edit Address Page */
    getEditAddress: (req, res) => {
        let userId = req.session.user._id
        let addressId = req.params.id
        orderHelpers.getEditAddress(addressId, userId).then((currentAddress) => {
            res.send(currentAddress)
        })
    },
    /* PATCH Edit Address Page */
    patchEditAddress: (req, res) => {
        let addressId = req.params.id
        let userId = req.session.user._id
        let userData = req.body
        console.log(userData, 'userData');
        orderHelpers.patchEditAddress(userId, addressId, userData).then((response) => {
            res.send(response)
        })
    },

    /* DELETE  Address Page */
    deleteAddress: (req, res) => {
        let userId = req.session.user._id
        let addressId = req.params.id
        orderHelpers.deleteAddress(userId, addressId).then((response) => {
            res.send(response)
        })
    },

    // getting order details
    orderDetails: async (req, res) => {
        let user = req.session.user;
        let count = await cartHelpers.getCartCount(user._id)
        let userId = req.session.user._id;
        let orderId = req.params.id;
        orderHelpers.findOrder(orderId, userId).then((orders) => {
            orderHelpers.findAddress(orderId, userId).then((address) => {
                orderHelpers.findProduct(orderId, userId).then((product) => {
                    console.log(orders[0].orderConfirm, '====');
                    let data = orderHelpers.createData(orders, product, address)
                    res.render('user/orderDetails', { layout: 'Layout', user, count, product,address, orders, orderId, data })
                })
            })
        })
    },
// cancel order
    cancelOrder: (req, res) => {
        let orderId = req.query.id;
        let total = req.query.total;
        let userId = req.session.user._id
        console.log(orderId, req.query.total, req.session.user._id);
        orderHelpers.cancelOrder(orderId).then((canceled) => {
            res.send(canceled)
            // })
        })
    },

    // payment verifcation
    
    verifyPayment: (req, res) => {
        console.log(req.session.user._id,'uuuu');
        console.log('came');
        console.log(req.body,'ppp');
        orderHelpers.verifyPayment(req.body).then(() => {
            orderHelpers.changePaymentStatus(req.session.user._id, req.body["order[receipt]"])
                .then(() => {
                    console.log('true');
                    res.json({ status: true })
                })
                .catch((err) => {
                    console.log('false');
                    res.json({ status: false })
                })
        })
    },
      
    //to change order Status 
    changeOrderStatus: (req, res) => {
        let orderId = req.body.orderId
        let status = req.body.status
        orderHelpers.changeOrderStatus(orderId, status).then((response) => {
            console.log(response);
            res.send(response)
        })
    },
  
// return order 
        returnOrder :(req,res)=>{
            let orderId=req.query.id
            let total= req.query.total
            let userId= req.session.user._id
            orderHelpers.returnOrder(orderId,userId).then((returnOrderStatus)=>{
                res.send(returnOrderStatus)
            })
        }
    
    
    }

