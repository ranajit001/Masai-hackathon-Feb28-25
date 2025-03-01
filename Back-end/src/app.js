import express from "express";
import cors from 'cors';
import dotenv from 'dotenv';
dotenv.config();

import connectDB from "./configs/mongodb.config.js";
import UserRouter from "./routes/user.route.js";



const app = express();


app.use(express.json());
app.use(cors())


app.use('/users',UserRouter);







const PORT = process.env.PORT ;


app.listen(+PORT,async () => {
    await connectDB();
    console.log('server started...');
    
})
