const Product = require('../models/Product');

const getProducts = async (req, res) => {
    try {
        const products = await Product.find().sort({createdAt: -1})
        res.json(products)
    } catch (error) {
        console.log('getProducts xatosi:', error.message)
        res.status(500).json({message: error.message})
    }
}

const getProductById = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id) 
        if(!product){
            return res.status(404).json({message: "Mahsulot topilmadi"})
        }
        console.log("mahsulot topildi:", product.name)
        res.json(product)
    } catch (error) {
        console.log('getProductById xatosi', error.message)
        res.status(500).json({message: error.message})
    }
}


const createProduct = async (req, res) => {
    try {
    const {
      name, description, price, oldPrice,
      category, sizes, colors, countInStock,
      isFeatured, badge
    } = req.body

    const product = await Product.create({
        name,
        description,
        price,
        oldPrice,
        category,
        sizes,
        colors,
        countInStock,
        isFeatured,
        badge,
        images:[]
    })

    console.log("Yangi mahsulot:", product.name)
    res.status(201).json(product)
    } catch (error) {
        console.log('createProduct xatosi:', error.message)
        res.status(500).json({message: error.message})
    }
}


const updateProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id)

    if (!product) {
      return res.status(404).json({ message: 'Mahsulot topilmadi!' })
    }

    const {
      name, description, price, oldPrice,
      category, sizes, colors, countInStock,
      isFeatured, badge
    } = req.body

    product.name = name || product.name
    product.description = description || product.description
    product.price = price || product.price
    product.oldPrice = oldPrice || product.oldPrice
    product.category = category || product.category
    product.sizes = sizes || product.sizes
    product.colors = colors || product.colors
    product.countInStock = countInStock ?? product.countInStock
    product.isFeatured = isFeatured ?? product.isFeatured
    product.badge = badge || product.badge

    const updatedProduct = await product.save()

    console.log('Mahsulot yangilandi:', updatedProduct.name)
    res.json(updatedProduct)

  } catch (error) {
    console.log('updateProduct xatosi:', error.message)
    res.status(500).json({ message: error.message })
  }
}


const deleteProduct = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id)

        if(!product){
            return res.status(404).json({message: "Mahsulot topilmadi!"})
        }

        await product.deleteOne()
        console.log("Mahsulot o'xhirildi", req.params.id)
        res.json({message: "Mahsulot o'chirildi"})
    } catch (error) {
        console.log("deleteProduct xatosi:", error.message)
        res.status(500).json({message: error.message})
    }
}

module.exports = {getProducts, getProductById, createProduct, updateProduct, deleteProduct}

