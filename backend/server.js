import dns from 'node:dns/promises';
dns.setServers(["1.1.1.1", "1.0.0.1"]);

import express from 'express';
import cors from 'cors'
import dotenv from 'dotenv';
dotenv.config();
import connectDB from './config/db.js';
import userRoutes from './routes/userRoutes.js'
import productRoutes from './routes/productRoutes.js'
import orderRoutes from './routes/orderRoutes.js'

const port = process.env.PORT || 5000;

connectDB();

const app = express();
app.use(cors())
app.use(express.json())

app.use('/api/orders', orderRoutes)

app.get('/', (req, res) => {
    res.send('API is running...');
});

app.use('/api/users', userRoutes)
app.use('/api/products', productRoutes)

app.listen(port, () =>
    console.log(`Server is running on port ${port}`)
);