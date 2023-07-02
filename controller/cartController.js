const express = require('express')
const cartModel = require('../models/cartSchema')
const cartHelpers = require('../helpers/cartHelpers')
const orderHelpers = require('../helpers/orderHelpers')

module.exports = {

    /* GET Cart Page */
    getCart: async (req, res) => {

        console.log('444');
        let userId = req.session.user._id
        let user = req.session.user
        let count = await cartHelpers.getCartCount(user._id)
        console.log('555');
        let total = await orderHelpers.totalCheckOutAmount(userId)
        console.log(userId,'777')

        let subTotal = await orderHelpers.getSubTotal(userId)

        cartHelpers.getCartItems(userId).then((cartItems) => {
         
           
            res.render('user/cart', { layout :'Layout', user, cartItems, subTotal, total, count})
        })
    },
        /* POST ADD To Cart Page */
        addToCart: (req, res) => {
            let proId = req.params.id
            let userId =  req.session.user._id
            console.log(proId,'proId');
            console.log(userId,'userId');
            cartHelpers.addToCart(proId,userId)
                .then((response) => {
                    console.log(response,'res');
                    res.send(response)
                })
        },
    
        /* POST Update cart quantity Page */
    updateQuantity: (req, res) => {
        let userId = req.session.user._id
        cartHelpers.updateQuantity(req.body).then(async (response) => {
        response.total = await orderHelpers.totalCheckOutAmount(userId)
        response.subTotal = await orderHelpers.getSubTotal(userId)
            res.json(response)
        })
    },

     /* Delete product from cart*/
     deleteProduct: (req, res) => {
        console.log('came here');
        console.log(req.body,'lol');
        cartHelpers.deleteProduct(req.body).then((response) => {
            res.send(response)
        })
    }
}

