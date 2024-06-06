import dotenv from 'dotenv'
import express from 'express'
import mongoose from 'mongoose'
const App = express();


dotenv.config({ path: './config.env'});
const DB = process.env.DATABASE;

const PORT = process.env.PORT;

mongoose.connect(DB).then(() => {
    console.log("Connection Successful")
}).catch((err) => console.log("errorrr"));


App.use(express.json());

import routerAuth from '../router/auth.js'
App.use(routerAuth);



App.listen(PORT, ()=>{
    console.log(`running on ${PORT}`)
});