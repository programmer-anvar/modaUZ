const mongoose = require('mongoose')

const ProductSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true
    },
    description: {
      type: String,
      required: true
    },
    price: {
      type: Number,
      required: true,
      min: 0
    },
    oldPrice: {
      type: Number,
      default: 0
    },
    category: {
      type: String,
      required: true,
      enum: ['erkaklar', 'ayollar', 'bolalar', 'aksesuar']
    },
    images: [
      {
        type: String
      }
    ],
    sizes: [
      {
        type: String
        // ["XS", "S", "M", "L", "XL"]
      }
    ],
    colors: [
      {
        type: String
      }
    ],
    countInStock: {
      type: Number,
      required: true,
      default: 0
    },
    rating: {
      type: Number,
      default: 0
    },
    numReviews: {
      type: Number,
      default: 0
    },
    isFeatured: {
      type: Boolean,
      default: false
    },
    badge: {
      type: String,
      enum: ['Yangi', 'Sale', 'Top', null],
      default: null
    }
  },
  { timestamps: true }
)

module.exports = mongoose.model('Product', ProductSchema)