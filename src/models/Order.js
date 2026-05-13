const mongoose = require('mongoose')

const OrderSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    items: [
      {
        product: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Product',
          required: true
        },
        name: {
          type: String,
          required: true
        },
        image: {
          type: String
        },
        price: {
          type: Number,
          required: true
        },
        size: {
          type: String
        },
        color: {
          type: String
        },
        quantity: {
          type: Number,
          required: true,
          default: 1
        }
      }
    ],
    shippingAddress: {
      fullName: { type: String, required: true },
      phone: { type: String, required: true },
      address: { type: String, required: true },
      city: { type: String, required: true }
    },
    paymentMethod: {
      type: String,
      required: true,
      enum: ['naqd', 'karta'],
      default: 'naqd'
    },
    itemsPrice: {
      type: Number,
      required: true,
      default: 0
    },
    shippingPrice: {
      type: Number,
      required: true,
      default: 0
    },
    totalPrice: {
      type: Number,
      required: true,
      default: 0
    },
    status: {
      type: String,
      enum: ['yangi', 'tasdiklandi', "yo'lda", 'yetkazildi', 'bekor'],
      default: 'yangi'
    },
    isPaid: {
      type: Boolean,
      default: false
    },
    paidAt: {
      type: Date
    },
    isDelivered: {
      type: Boolean,
      default: false
    },
    deliveredAt: {
      type: Date
    },
    note: {
      type: String,
      trim: true
    }
  },
  { timestamps: true }
)

module.exports = mongoose.model('Order', OrderSchema)