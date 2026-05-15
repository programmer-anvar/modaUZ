const Order = require('../models/Order')
const Product = require('../models/Product')

// ========================
// CREATE ORDER — buyurtma berish
// POST /api/orders
// Login bo'lgan har kim!
// ========================
const createOrder = async (req, res) => {
  try {
    const {
      items,
      shippingAddress,
      paymentMethod
    } = req.body

    // Items bo'sh bo'lsa
    if (!items || items.length === 0) {
      return res.status(400).json({ message: 'Buyurtmada mahsulot yo\'q!' })
    }

    // Jami narxni hisoblaymiz
    const itemsPrice = items.reduce((total, item) => {
      return total + (item.price * item.quantity)
    }, 0)
    // reduce = array ni aylanib, har birini qo'shib boradi
    // total = hozirgi yig'indi
    // 0 = boshlang'ich qiymat

    // Yetkazib berish narxi
    const shippingPrice = itemsPrice > 200000 ? 0 : 15000
    // 200 000 dan ko'p bo'lsa — bepul!
    // Kam bo'lsa — 15 000 so'm

    const totalPrice = itemsPrice + shippingPrice

    const order = await Order.create({
      user: req.user._id,
      // req.user = protect middleware dan keladi
      items,
      shippingAddress,
      paymentMethod,
      itemsPrice,
      shippingPrice,
      totalPrice
    })

    console.log('Yangi buyurtma:', order._id)
    res.status(201).json(order)

  } catch (error) {
    console.log('createOrder xatosi:', error.message)
    res.status(500).json({ message: error.message })
  }
}

// ========================
// GET MY ORDERS — o'z buyurtmalarini ko'rish
// GET /api/orders/myorders
// ========================
const getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id })
      .sort({ createdAt: -1 })
    // faqat shu foydalanuvchining buyurtmalari

    console.log('Buyurtmalar soni:', orders.length)
    res.json(orders)

  } catch (error) {
    console.log('getMyOrders xatosi:', error.message)
    res.status(500).json({ message: error.message })
  }
}

// ========================
// GET ORDER BY ID — bitta buyurtma
// GET /api/orders/:id
// ========================
const getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate('user', 'name email')
    // populate = user ID si o'rniga user ma'lumotlarini yuklaydi
    // 'name email' = faqat name va email ni yuklaydi

    if (!order) {
      return res.status(404).json({ message: 'Buyurtma topilmadi!' })
    }

    res.json(order)

  } catch (error) {
    console.log('getOrderById xatosi:', error.message)
    res.status(500).json({ message: error.message })
  }
}

// ========================
// GET ALL ORDERS — barcha buyurtmalar
// GET /api/orders
// Faqat admin!
// ========================
const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate('user', 'name email')
      .sort({ createdAt: -1 })

    console.log('Jami buyurtmalar:', orders.length)
    res.json(orders)

  } catch (error) {
    console.log('getAllOrders xatosi:', error.message)
    res.status(500).json({ message: error.message })
  }
}

// ========================
// UPDATE ORDER STATUS — buyurtma holatini o'zgartirish
// PUT /api/orders/:id/status
// Faqat admin!
// ========================
const updateOrderStatus = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)

    if (!order) {
      return res.status(404).json({ message: 'Buyurtma topilmadi!' })
    }

    const { status } = req.body

    order.status = status

    // Yetkazildi bo'lsa
    if (status === 'yetkazildi') {
      order.isDelivered = true
      order.deliveredAt = Date.now()
    }

    // To'landi bo'lsa
    if (status === 'tasdiklandi') {
      order.isPaid = true
      order.paidAt = Date.now()
    }

    const updatedOrder = await order.save()

    console.log('Buyurtma holati yangilandi:', updatedOrder.status)
    res.json(updatedOrder)

  } catch (error) {
    console.log('updateOrderStatus xatosi:', error.message)
    res.status(500).json({ message: error.message })
  }
}

module.exports = {
  createOrder,
  getMyOrders,
  getOrderById,
  getAllOrders,
  updateOrderStatus
}