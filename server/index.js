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
