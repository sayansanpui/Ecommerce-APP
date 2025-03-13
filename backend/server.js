import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import connectDB from './config/mongodb.js';
import connectCloudinary from './config/cloudinary.js';
import UserRouter from './routes/userRoute.js';
import productRouter from './routes/productRoute.js';

//App Config
const app = express();
const port = process.env.PORT || 4000;
connectDB();
connectCloudinary();

//Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

//API Endpoints
app.use('/api/user', UserRouter);
app.use('/api/product', productRouter);

app.get('/', (req, res) => {
    res.send('API Working');
});

app.listen(port, () => console.log(`Server is running on port ${port}`)
);