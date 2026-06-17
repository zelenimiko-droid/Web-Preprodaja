import express from 'express'
import jwt from 'jsonwebtoken'
import Order from '../models/orderModel.js'

const router = express.Router()

// Middleware za autentifikaciju
const protect = (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1]
    if (!token) return res.status(401).json({ message: 'Nije autorizovan' })
    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    req.userId = decoded.id
    req.isAdmin = decoded.isAdmin
    next()
}

// Kreiranje porudžbine
router.post('/', protect, async (req, res) => {
    const {
        orderItems,
        shippingAddress,
        paymentMethod,
        itemsPrice,
        totalPrice,
    } = req.body

    if (orderItems && orderItems.length === 0) {
        return res.status(400).json({ message: 'Nema proizvoda u porudžbini' })
    }

    const order = new Order({
        user: req.userId,
        orderItems,
        shippingAddress,
        paymentMethod,
        itemsPrice,
        taxPrice: 0,
        shippingPrice: 0,
        totalPrice,
        isPaid: true,
        paidAt: Date.now(),
    })

    const createdOrder = await order.save()
    res.status(201).json(createdOrder)
})

// Sve porudžbine (admin)
router.get('/', protect, async (req, res) => {
    const orders = await Order.find({}).populate('user', 'name email')
    res.json(orders)
})

// Porudžbine korisnika
router.get('/myorders', protect, async (req, res) => {
    const orders = await Order.find({ user: req.userId })
    res.json(orders)
})

export default router