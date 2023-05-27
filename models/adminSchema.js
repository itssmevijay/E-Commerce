const mongoose = require("mongoose")

const adminSchema = new mongoose.Schema({
    
    email : {
        type :String
    },

    password : {
        type : String
    }

})

module.exports = {
    Admin : mongoose.model('admin',adminSchema)
}