import dns from 'node:dns/promises';
dns.setServers(["1.1.1.1", "1.0.0.1"]);

import express from 'express';
import cors from 'cors'
import dotenv from 'dotenv';
dotenv.config();
import connectDB from './config/db.js';
import products from './data/products.js';
import userRoutes from './routes/userRoutes.js'

const port = process.env.PORT || 5000;

connectDB();

const app = express();
app.use(cors())
app.use(express.json())

app.get('/', (req, res) => {
    res.send('API is running...');
});

app.get('/api/products/:id', (req, res) => {
    const product = products.find((p) => p._id === req.params.id);
    res.json(product);
});

app.get('/api/products', (req, res) => {
    res.json(products);
});

app.use('/api/users', userRoutes)

app.listen(port, () =>
    console.log(`Server is running on port ${port}`)
);