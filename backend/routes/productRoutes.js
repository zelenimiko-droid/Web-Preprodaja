import express from 'express'
import Product from '../models/productModel.js'

const router = express.Router()

// Svi proizvodi sa pretragom i filterom
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

// Jedan proizvod
router.get('/:id', async (req, res) => {
    const product = await Product.findById(req.params.id)
    if (product) {
        res.json(product)
    } else {
        res.status(404).json({ message: 'Proizvod nije pronađen' })
    }
})

// Brisanje proizvoda (admin)
router.delete('/:id', async (req, res) => {
    const product = await Product.findById(req.params.id)
    if (product) {
        await Product.deleteOne({ _id: product._id })
        res.json({ message: 'Proizvod obrisan' })
    } else {
        res.status(404).json({ message: 'Proizvod nije pronađen' })
    }
})

export default router