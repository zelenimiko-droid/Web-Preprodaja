import dns from 'node:dns/promises'
dns.setServers(["1.1.1.1", "1.0.0.1"])

import mongoose from 'mongoose'
import dotenv from 'dotenv'
import connectDB from './config/db.js'
import Product from './models/productModel.js'
import User from './models/userModel.js'

dotenv.config()
connectDB()

const importData = async () => {
    try {
        await Product.deleteMany()

        const adminUser = await User.findOne({ isAdmin: true })

        const products = [
            {
                user: adminUser._id,
                name: 'iPhone 14 Pro',
                image: 'https://via.placeholder.com/300x200',
                description: 'Odličan iPhone u odličnom stanju, malo korišćen.',
                price: 850,
                category: 'Telefoni',
                countInStock: 3,
                rating: 4.5,
                numReviews: 12,
            },
            {
                user: adminUser._id,
                name: 'Samsung Galaxy S23',
                image: 'https://via.placeholder.com/300x200',
                description: 'Samsung Galaxy S23, kupljen pre 6 meseci.',
                price: 650,
                category: 'Telefoni',
                countInStock: 1,
                rating: 4.0,
                numReviews: 8,
            },
            {
                user: adminUser._id,
                name: 'Laptop Lenovo ThinkPad',
                image: 'https://via.placeholder.com/300x200',
                description: 'Poslovni laptop, idealan za rad i učenje.',
                price: 500,
                category: 'Laptopovi',
                countInStock: 2,
                rating: 4.8,
                numReviews: 20,
            },
            {
                user: adminUser._id,
                name: 'Nike Air Max 90',
                image: 'https://via.placeholder.com/300x200',
                description: 'Patike broj 43, nošene samo jednom.',
                price: 80,
                category: 'Obuća',
                countInStock: 1,
                rating: 3.5,
                numReviews: 5,
            },
            {
                user: adminUser._id,
                name: 'PlayStation 5',
                image: 'https://via.placeholder.com/300x200',
                description: 'PS5 konzola sa dva džojstika, sve u kutiji.',
                price: 450,
                category: 'Gaming',
                countInStock: 1,
                rating: 5.0,
                numReviews: 30,
            },
            {
                user: adminUser._id,
                name: 'Bicikl Trek',
                image: 'https://via.placeholder.com/300x200',
                description: 'Planinski bicikl, servisiran ove godine.',
                price: 300,
                category: 'Sport',
                countInStock: 1,
                rating: 4.2,
                numReviews: 7,
            },
        ]

        await Product.insertMany(products)
        console.log('Podaci uspešno uvezeni!')
        process.exit()
    } catch (error) {
        console.log(`Greška: ${error.message}`)
        process.exit(1)
    }
}

importData()