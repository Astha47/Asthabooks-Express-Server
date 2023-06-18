const express = require('express');
const app = express();
const mongoose = require('mongoose');
const Repository = require('./models/repositoriesModel');

// ASIGN DOTENV
require("dotenv").config();
// ASIGN EXPRESS JSON
app.use(express.json())


// VAR INIT
const PORT = process.env.PORT;
const mongodbAPI = process.env.MONGODB_API;


// MAIN ROUTE
app.get('/', (req, res) => {
    res.send('Asthabooks API')
})

// GET ALL DATA
app.get('/repositories', async (req,res) => {
    try {
        const repositories = await Repository.find({});
        res.status(200).json(repositories)
    } catch (error) {
        res.status(500).json({message: error.message})
    }
});

// GET SELECTED DATA
app.get('/repository/:id', async (req,res) => {
    try {
        const {id} = req.params;
        const repository = await Repository.findById(id);
        res.status(200).json(repository)
    } catch (error) {
        res.status(500).json({message: error.message})
    }
});

// POST A DATA
app.post('/repository', async (req, res) => {
    console.log(req.body);

    try{
        const repository = await Repository.create(req.body);
        res.status(200).json(repository);
    } catch (error) {
        console.log(error.message);
        res.status(500).json({message: error.message})
    }
})


// MONGODB CONNECTION
mongoose.connect(mongodbAPI)
.then(() => {
    console.log('connected to mongodb')
    app.listen(PORT, () => {
        console.log('Node API app is running on port',PORT)
    })
}).catch((error) => {
    console.log(error)
})