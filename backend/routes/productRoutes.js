import express from 'express'
import Product from '../models/productModel.js'

const router = express.Router()

router.get('/', async (req, res) => {
    const keyword = req.query.keyword
        ? { name: { $regex: req.query.keyword, $options: 'i' } }
        : {}

    const category = req.query.category
        ? { category: req.query.category }
        : {}

    const products = await Product.find({ ...keyword, ...category })
    res.json(products)
})

router.get('/:id', async (req, res) => {
    const product = await Product.findById(req.params.id)
    if (product) {
        res.json(product)
    } else {
        res.status(404).json({ message: 'Proizvod nije pronađen' })
    }
})

export default router