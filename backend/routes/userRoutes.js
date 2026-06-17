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

// Ažuriranje profila
router.put('/profile', async (req, res) => {
    const token = req.headers.authorization?.split(' ')[1]
    if (!token) return res.status(401).json({ message: 'Nije autorizovan' })

    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    const user = await User.findById(decoded.id)

    if (user) {
        user.name = req.body.name || user.name
        user.email = req.body.email || user.email
        if (req.body.password) {
            const salt = await bcrypt.genSalt(10)
            user.password = await bcrypt.hash(req.body.password, salt)
        }
        const updatedUser = await user.save()
        const newToken = jwt.sign({ id: updatedUser._id }, process.env.JWT_SECRET, {
            expiresIn: '30d',
        })
        res.json({
            _id: updatedUser._id,
            name: updatedUser.name,
            email: updatedUser.email,
            isAdmin: updatedUser.isAdmin,
            token: newToken,
        })
    } else {
        res.status(404).json({ message: 'Korisnik nije pronađen' })
    }
})

// Svi korisnici (admin)
router.get('/', async (req, res) => {
    const users = await User.find({})
    res.json(users)
})

// Brisanje korisnika (admin)
router.delete('/:id', async (req, res) => {
    const user = await User.findById(req.params.id)
    if (user) {
        await User.deleteOne({ _id: user._id })
        res.json({ message: 'Korisnik obrisan' })
    } else {
        res.status(404).json({ message: 'Korisnik nije pronađen' })
    }
})

export default router