const express = require('express');
const app = express();
const mongoose = require('mongoose');
const cors = require('cors');

// ===============================================================================================
// ASSIGN DATA MODEL
const Repository = require('./models/repositoriesModel');
const Account = require('./models/accountModel')
const Registrants = require('./models/registrantsModel')

// ===============================================================================================

// ASIGN DOTENV
require("dotenv").config();
// ASIGN EXPRESS JSON
app.use(express.json())
// ASIGN EXPRESS URLENCODED
app.use(express.urlencoded({extended: false}))

// OAUTH API CORS

app.use(cors({
    methods: ['GET', 'POST', 'PUT', 'DELETE']
}));
  

// app.use(
//     cors({
//         origin: ['http://localhost:3000', 'http://localhost:3000/auth', 'https://asthabooks-react.vercel.app', 'https://asthabooks-next.vercel.app'],
//         methods: {
//             'http://localhost:3000': ['GET', 'POST', 'PUT'],
//             'http://localhost:3000/auth': ['GET', 'POST', 'PUT'],
//             'https://asthabooks-next.vercel.app': ['GET', 'POST', 'PUT'],
//             'https://asthabooks-react.vercel.app': ['GET']
//         }
//     })
// )


// VAR INIT
const PORT = process.env.PORT;
const mongodbAPI = process.env.MONGODB_API;


// MAIN ROUTE
app.get('/', (req, res) => {
    res.send('Asthabooks API')
})


// Mailer
const nodeMailer = require('nodemailer')

// Mail format
const html = (username, token) => {
    `
    <h1>helllo</h>
    <p>this is your username ${username} and this is your token ${token}</p>
    `
};

async function sendEmail (){
    const transporter = nodeMailer.createTransport({
        host: 'smtp.gmail.com',
        port: 465,
        secure: true,
        auth: {
            user : process.env.USERNAME_MAIL,
            pass: process.env.PASS
        }
    });

    const info = await transporter.sendMail({
        from: "Asthabooks <asthaframework@gmail.com>",
        to: 'anasfathurrahman.edu@gmail.com',
        subject: 'testing',
        html: html("sadasda", "awdasdasasda"),
    })
    console.log("message sent: " + info.messageId);
}




// ===============================================================================================
// REPOSITORY ROUTER
// ===============================================================================================

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

// POST A REGISTRANTS DATA
app.post('/account/regist', async (req, res) => {
    try{
        // Membuat string acak sepanjang 30 karakter
        const tempToken = Array.from({length: 60}, () => Math.floor(Math.random() * 36).toString(36)).join('');

        // Membuat objek baru dengan data dari req.body
        const registrantData = {...req.body};

        registrantData.temptoken = tempToken
        const registrants = await Registrants.create(registrantData);
        console.log(registrants)
        res.status(200).json(registrants);
    } catch (error) {
        console.log(error.message);
        res.status(500).json({message: error.message})
    }
})



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

// GET EMAIL AVAILABILITY

app.get('/account/email_availability/:email', async (req, res) => {
    const {email} = req.params;
    try {
        // Cari akun dengan email yang diberikan
        const account = await Account.findOne({ email: email });
        const accountWaiting = await Registrants.findOne({ email: email });

        // Jika akun tidak ditemukan, kembalikan availability: true
        if (!account && !accountWaiting) {
            return res.json({ availability: true });
        }

        // Jika akun ditemukan, kembalikan availability: false
        return res.json({ availability: false });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Terjadi kesalahan pada server' });
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
app.post('/account/add', async (req, res) => {
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
