const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();

app.use(cors());

app.use(cors());

app.use(express.json());
app.use(express.urlencoded({extended: true}));

app.get('/', (req, res) => {
    res.json({message: "ModaUz Server is workiung"})
})


mongoose.connect(process.env.MONGO_URI)
.then(() => {
    console.log("✅ connectted mongoose")
    app.listen(process.env.PORT, () => {
        console.log(`✅ Server is working http://localhost:${process.env.PORT}`)
    })
}).catch((err) => {
    console.log("❌ MongoDB is not connect:", err.message)
})