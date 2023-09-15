const express = require('express');
const mongoose = require("mongoose");
const cors = require("cors");
const env = require("dotenv/config");
const cookieParser = require("cookie-parser")
const UserRoutes = require('./Routes/User')
const ThreadRoutes = require('./Routes/Threads')
const path = require('path')
const serverless = require('serverless-http')


const PORT = 8000;
const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());


app.use('/', UserRoutes);
app.use('/', ThreadRoutes);
app.use('/Uploads', express.static(path.join(__dirname, '/Uploads')))

const URI = process.env.MONGO_URI

mongoose.connect(URI, { useNewUrlParser: true })
    .then(() => {
        app.listen(PORT, () => {
            console.log(`Server connected at ${PORT}`)
        })

    }).catch((error) => {
        console.log(error)
    })