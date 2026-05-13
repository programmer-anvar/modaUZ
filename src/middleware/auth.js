const jwt = require('jsonwebtoken');
const User = require('../models/User');


const protect = async (req, res, next) => {
    let token

    if(req.headers.authorization && req.headers.authorization.startsWith('Bearer')){
        try {
            token = req.headers.authorization.split(' ')[1]
            const decoded = jwt.verify(token, process.env.JWT_SECRET)
            req.user = await User.findById(decoded.id).select('-password')
            console.log("Foydalanuvchi:", req.user.name)
            next()
        } catch (error) {
            console.log('Token xatosi:', error.message)
            res.status(401).json({message: 'Token yaraqsoz'})
        }
    }

    if(!token){
        res.status(401).json({ message: 'Token topilmadi, login qling!'})
    }
}

const admin = (req, res, next) => {
    if(req.user && req.user.role === 'admin'){
        next()
    }else{
        res.status(403).json({ message: "Faqat admin uchun!"})
    }
}
module.exports = { protect, admin };