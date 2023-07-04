const express = require('express');
const app = express();
const mongoose = require('mongoose');
const cors = require('cors');

// ===============================================================================================
// ASSIGN DATA MODEL
const Repository = require('./models/repositoriesModel');
const Account = require('./models/accountModel')

// ===============================================================================================

// ASIGN DOTENV
require("dotenv").config();
// ASIGN EXPRESS JSON
app.use(express.json())
// ASIGN EXPRESS URLENCODED
app.use(express.urlencoded({extended: false}))

// OAUTH API CORS
app.use(
    cors({
        origin: ['http://localhost:3000', 'https://asthabooks-react.vercel.app'],
        methods: {
            'http://localhost:3000': ['GET', 'POST', 'PUT'],
            'https://asthabooks-react.vercel.app': ['GET']
        }
    })
)


// VAR INIT
const PORT = process.env.PORT;
const mongodbAPI = process.env.MONGODB_API;


// MAIN ROUTE
app.get('/', (req, res) => {
    res.send('Asthabooks API')
})

// ===============================================================================================
// REPOSITORY ROUTER
// ===============================================================================================

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

// UPDATE A DATA
app.put('/repository/:id', async (req, res) => {
    try {
        const {id} = req.params;
        const repository = await Repository.findByIdAndUpdate(id, req.body);
        // UPDATE RESPONSES
        const newrepository = await Repository.findById(id);
        res.status(200).json(newrepository);
    } catch (error) {
        res.status(500).json({message: error.message})
    }
})


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

// DELETE A DATA
app.delete('/repository/:id', async (req, res) => {
    try {
        const {id} = req.params;
        const repository = await Repository.findByIdAndDelete(id);
        if (!repository) {
            return res.status(404).json({ message: `Cannot find any data with ID : ${id}`})
        }
        res.status(200).json(repository)
    } catch (error) {
        res.status(500).json({message: error.message})
    }
})

// ===============================================================================================
// ACCOUNT API ROUTER
// ===============================================================================================

// GET ALL DATA
app.get('/accounts', async (req,res) => {
    try {
        const accounts = await Account.find({});
        res.status(200).json(accounts)
    } catch (error) {
        res.status(500).json({message: error.message})
    }
});

// GET SELECTED DATA
app.get('/account/:username', async (req,res) => {
    try {
        const {username} = req.params;
        const account = await Account.findOne({username: username});

        res.status(200).json(account)
    } catch (error) {
        res.status(500).json({message: error.message})
    }
});

// UPDATE A DATA
app.put('/account/:username', async (req, res) => {
    try {
        const {username} = req.params;
        const account = await Account.findByIdAndUpdate(username, req.body);
        // UPDATE RESPONSES
        const newaccount = await Account.findById(username);
        res.status(200).json(newaccount);
    } catch (error) {
        res.status(500).json({message: error.message})
    }
})


// POST A DATA
app.post('/account', async (req, res) => {
    try{
        const account = await Account.create(req.body);
        res.status(200).json(account);
    } catch (error) {
        console.log(error.message);
        res.status(500).json({message: error.message})
    }
})

// DELETE A DATA
app.delete('/account/:id', async (req, res) => {
    try {
        const {id} = req.params;
        const account = await Account.findByIdAndDelete(id);
        if (!account) {
            return res.status(404).json({ message: `Cannot find any data with ID : ${id}`})
        }
        res.status(200).json(account)
    } catch (error) {
        res.status(500).json({message: error.message})
    }
})

// ===============================================================================================

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