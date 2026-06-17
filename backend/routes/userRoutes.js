import express from 'express'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import User from '../models/userModel.js'

const router = express.Router()

// Registracija
router.post('/register', async (req, res) => {
    const { name, email, password } = req.body

    const userExists = await User.findOne({ email })
    if (userExists) {
        return res.status(400).json({ message: 'Korisnik već postoji' })
    }

    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(password, salt)

    const user = await User.create({
        name,
        email,
        password: hashedPassword,
    })

    if (user) {
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
            expiresIn: '30d',
        })
        res.status(201).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            isAdmin: user.isAdmin,
            token,
        })
    } else {
        res.status(400).json({ message: 'Nevalidni podaci' })
    }
})

// Login
router.post('/login', async (req, res) => {
    const { email, password } = req.body

    const user = await User.findOne({ email })

    if (user && (await bcrypt.compare(password, user.password))) {
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
            expiresIn: '30d',
        })
        res.json({
            _id: user._id,
            name: user.name,
            email: user.email,
            isAdmin: user.isAdmin,
            token,
        })
    } else {
        res.status(401).json({ message: 'Pogrešan email ili lozinka' })
    }
})

export default router