
const mongoose= require('mongoose')
const categorySchema = new mongoose.Schema({
  category: {
      type: String
  },
  sub_category: [{
      name: {
          type: String
      },
  }]
});

  module.exports = {
    Category : mongoose.model('category',categorySchema)
}