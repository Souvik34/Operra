import express from 'express';
const app = express();


import dotenv from 'dotenv';
dotenv.config({
    path: './.env'
});


const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
    console.log(`Server running at:`, PORT);
})