const express = require('express');
const app = express();
const mongoose = require('mongoose');
const cors = require('cors');
const CookiePraser = require('cookie-parser')
const jwt = require('jsonwebtoken');

// ===============================================================================================
// ASSIGN DATA MODEL
const Repository = require('./models/repositoriesModel');
const RepositoryData = require('./models/repositoriesDataModel');
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

// COOKIES MIDDLEWARE
app.use(CookiePraser());

// ===========================================================//
//  CLOUDINARY //
// import {v2 as cloudinary} from 'cloudinary';

// cloudinary.config({ 
//     cloud_name: process.env.CLOUD_NAME_CLOUDINARY, 
//     api_key: process.env.API_KEY_CLOUDINARY, 
//     api_secret: process.env.API_SECRET_CLOUDINARY
//   });

// ===========================================================//


// VAR INIT
const PORT = process.env.PORT;
const mongodbAPI = process.env.MONGODB_API;
const TOKEN = process.env.ASTHABOOKS


// MAIN ROUTE
app.get('/', (req, res) => {
    res.send('Asthabooks API')
})


// Mailer
const nodeMailer = require('nodemailer')

// Mail format
const html = (username, token) => {

    const link_verification = 'https://asthabooks.vercel.app/auth/confirmation/gate/'+username+'/'+token
    //const link_verification = 'http://localhost:8000/account/verify/'+username+'/'+token;

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
    console.log("pengiriman dimulai", Date())
    const transporter = nodeMailer.createTransport({
        service: 'gmail',
        host: 'smtp.gmail.com',
        port: 465,
        secure: true,
        auth: {
            user : process.env.USERNAME_MAIL,
            pass: process.env.PASS
        },
        tls: {
            // do not fail on invalid certs
            rejectUnauthorized: false,
        },
    });

    try {
        const info = await transporter.sendMail({
            from: "Asthabooks <asthaframework@gmail.com>",
            to: email,
            subject: 'Account Verification',
            html: html(username, token),
        })
        if (info){
            console.log("pengiriman email berhasil dijalankan pada", Date(), info);
        }
        return info
    } catch (error) {
        console.error("Terjadi kesalahan saat mengirim email:", error);
        return error
    }    
}



// ===============================================================================================
// REPOSITORY ROUTER
// ===============================================================================================

// COOKIES

const maxAge = 7 * 24 * 60 * 60 * 1000;

const createToken = (id) => {
    return jwt.sign({ id }, process.env.JWT, {
        expiresIn : maxAge
    });
}


app.get('/set-cookies', (req, res) => {
    // res.setHeader('Set-Cookie', 'newUser=true');

    res.cookie('newUser', false);
    res.cookie('isEmployee', true, {maxAge: 1000 * 60 * 60 * 24 * 7});
})

app.get('/read-cookies', (req, res) => {
    const cookies = req.cookies;
    console.log(cookies)
    res.json(cookies);
})

// GET Updates

app.get('/component/update-latest/:token', async (req, res) => {
    try {
        const { token } = req.params; 
        if (token !== TOKEN) {
            return res.status(403).json({ message: 'Unauthorized access' });
        }

        const repositories = await Repository.find({})
            .sort({ updatedAt: -1 }) // Mengurutkan data berdasarkan updatedAt secara descending
            .limit(10); // Mengambil hanya 10 data teratas

        res.status(200).json(repositories);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});


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
            
            let registfeedback = await sendEmail(registrantData.username, registrantData.temptoken, registrantData.email)
            const registrants = await Registrants.create(registrantData);
            res.status(200).json({ 
                action: "success",
                messageId: registfeedback.messageId 
            });
            
        } else {
            res.status(400).json({ action: 'email already exist'});
            console.log('emailnya udah ada masbro')
        }
    } catch (error) {
        console.log(error.message);
        res.status(500).json({message: error.message})
    }
})

// LOGIN FUNCTION

app.post('/account/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await Account.login(email, password);
        const token = createToken(user);
        // res.cookie('asthaID', token, {httpOnly:true, maxAge: maxAge});
        res.status(200).json({ asthaID : token});
        // console.log("user : ", user, " berhasil dikirim")
    }
    catch (error){
        // console.log(error.message);
        res.status(400).json({"error" : error.message});
    }
});

app.get('/account/UserValidation', async (req, res) => {
    const cookies = req.cookies;
    
})



// DELETE ACCOUNT (DEBUGGING PURPOSE ONLY)

app.delete('/deleteAccount', async (req, res) => {
    const { email } = req.body;
    //console.log(email)

    try {
        const registrant = await Registrants.findOneAndDelete({ email });

        if (!registrant) {
            return res.status(404).json({ message: 'Akun dengan email tersebut tidak ditemukan.' });
        }

        res.status(200).json({ message: 'Akun berhasil dihapus.' });
    } catch (err) {
        res.status(500).json({ message: 'Terjadi kesalahan saat menghapus akun.', error: err.message });
    }
});

// EMAIL VERIFICATION

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
                
                
                //Mencari token kosong
                let token_availability = false
                let token = ''
                while(!token_availability){
                    const tokenTemp = Array.from({length: 60}, () => Math.floor(Math.random() * 36).toString(36)).join('');
                    const isToken = await Account.findOne({ token: tokenTemp });
                    if (!isToken) {
                        token_availability = true
                        token = tokenTemp
                    }
                }
                const newaccount = {
                    username: isAccount.username,
                    password: isAccount.password,
                    token : token,
                    email : isAccount.email,
                    role : isAccount.role
                }

                const createAcc = await Account.create(newaccount);
                const deleteRegist = await Registrants.findByIdAndDelete(isAccount.id);
                
                console.log("berhasil dipindahkan")
                res.status(200).json({ action: "success" });
            } else {
                return res.json({ action: "failed", message : "Token tidak sesuai" });
            }
        } else {
            return res.json({ action: "failed", message : "Data tidak ditemukan" });
        }
    } catch (error) {
        console.error(error);
        return res.status(500).json({action: "failed", message: 'Terjadi kesalahan pada server' });
    }
});

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


// Email sending test

// app.get('/debug/email', async (req, res) => {
//     try {
//         let feedback = await sendEmail('developer', 'abcd', 'anasfathurrahman.edu@gmail.com');
//         res.status(200).json({ action: feedback });
//     } catch (error){
//         res.status(500).json({ action: "debug email failed" });
//     }
// });