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

    const link_verification = 'https://cute-ruby-chipmunk-fez.cyclic.app/account/verify/'+username+'/'+token
    // const link_verification = 'http://localhost:8000/account/verify/'+username+'/'+token;

    return `
    <body style="display: flex; height: 100vh; font-family: Arial, sans-serif;">
        <div class="container" style="margin: auto; max-width: 100vw;">
            <div class="header" style="background-color: #0b0b27; 
            height: 200px; 
            display: flex; 
            background-color: #0b0b27;
            text-align: center;
            padding: 20px;
            width: 100%;">
                <img src="https://res.cloudinary.com/dggk9y0yt/image/upload/f_auto,q_auto/v1/Asthabooks/Logo/bgip7borld66pvk6uktu" alt="Logo" style="height: 100px; width: auto; margin: auto;">
            </div>
            <div class="content" style="
            padding-top: 50px; 
            padding-left: 20px; 
            margin: 20px;
            height: 400px;">
                <h1>Terima Kasih Telah Mendaftar</h1>
                <p>Silakan klik tombol di bawah ini untuk memverifikasi akun Anda.</p>
                <a href=${link_verification}>
                    <button style="
                    background-color: #4CAF50; 
                    color: white; 
                    padding: 15px 32px; 
                    text-align: center; 
                    text-decoration: none; 
                    display: inline-block; 
                    font-size: 16px; 
                    margin: 4px 2px; 
                    cursor: pointer; 
                    border: 0; 
                    border-radius: 6px;
                    cursor: pointer;"
                    >Verifikasi Akun</button>
                </a>
            </div>
            <div class="footer" style="
            background-color: #0b0b27; 
            color: white; 
            width: 100%; 
            text-align: center;
            padding: 20px;
            width: 100%;">
                © Asthabooks 2023
            </div>
        </div>
    </body>
    `;
};

async function sendEmail (username, token, email){
    const transporter = nodeMailer.createTransport({
        host: 'smtp.gmail.com',
        port: 465,
        secure: true,
        auth: {
            user : process.env.USERNAME_MAIL,
            pass: process.env.PASS
        }
    });

    console.log('ini data akun')
    console.log(process.env.USERNAME_MAIL)
    console.log(process.env.PASS)

    try {
        const info = await transporter.sendMail({
            from: "Asthabooks <asthaframework@gmail.com>",
            to: email,
            subject: 'Account Verification',
            html: html(username, token),
        })
        console.log("pengiriman email dijalankan")
        console.log(info);
    } catch (error) {
        console.error("Terjadi kesalahan saat mengirim email:", error);
    }    
    

    console.log("pengiriman email dijalankan")
    console.log(info);
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
        // Membuat objek baru dengan data dari req.body
        const registrantData = {...req.body};
        const isExistInQueue = await Registrants.findOne({ email: registrantData.email });
        const isExistInData = await Account.findOne({ email: registrantData.email });

        if ((!isExistInQueue)&&(!isExistInData)){
            // Membuat string acak sepanjang 30 karakter
            const tempToken = Array.from({length: 60}, () => Math.floor(Math.random() * 36).toString(36)).join('');
    
            registrantData.temptoken = tempToken
            const registrants = await Registrants.create(registrantData);
            //console.log(registrants)
            sendEmail(registrants.username, registrants.temptoken, registrants.email)
            console.log('sendEmail');
            res.status(200).json({ action: "success" });
        } else {
            res.status(400).json({ action: 'email already exist'});
            console.log('emailnya udah ada masbro')
        }
    } catch (error) {
        console.log(error.message);
        res.status(500).json({message: error.message})
    }
})

// Account Verification

app.get('/account/verify/:email/:temptoken', async (req, res) => {
    const {email,temptoken} = req.params;
    try {
        // Jika akun ditemukan,
        let keyEmail = email.toString();
        console.log(email)
        console.log(temptoken)
        const isAccount = await Registrants.findOne({ email: keyEmail });
        if (isAccount){
            if (isAccount.temptoken == temptoken){
                //console.log(isAccount)
                const token = Array.from({length: 60}, () => Math.floor(Math.random() * 36).toString(36)).join('');
                const newaccount = {
                    username: isAccount.username,
                    password: isAccount.password,
                    token : token,
                    email : isAccount.email
                }

                const createAcc = await Account.create(newaccount);
                const deleteRegist = await Registrants.findByIdAndDelete(isAccount.id);
                //console.log(createAcc)
                //console.log(deleteRegist)
                console.log("berhasil dipindahkan")
                res.status(200).json({ action: "success" });
            } else {
                return res.json({ availability: "token salah" });
            }
        } else {
            return res.json({ availability: false });
        }
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Terjadi kesalahan pada server' });
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
