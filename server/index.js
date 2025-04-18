import express from 'express';
const app = express();
import dotenv from 'dotenv';
dotenv.config({
    path:'./.env'
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
    console.log(`Server running at:`, PORT);
})

// Database connection
import connectDB from './src/db/index.js';
connectDB();
app.use(express.json())


// import routes

import authRouter from './src/routes/auth.route.js';
app.use('/api/v1/auth', authRouter);

import userRouter from './src/routes/user.route.js';
app.use('/api/v1/user', userRouter);

import taskRouter from './src/routes/task.route.js';
app.use('/api/v1/task', taskRouter);

import reportRouter from './src/routes/report.route.js'
app.use('/api/v1/report', reportRouter);


//error handling
app.use((err, req, res, next) =>
    {
        const statusCode = err.statusCode ||500
        const message= err.message || "Internal server error"
    
        return res.status(statusCode).json({
            success:false,
            statusCode,
            message,
        })
        
      
    })
