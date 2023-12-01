const mongoose = require('mongoose');
const { type } = require('os');
const bcrypt = require('bcrypt')

const registrantsSchema = mongoose.Schema(
    {
        username:{
            type: String,
            require: true
        },
        password:{
            type: String,
            require: true
        },
        temptoken:{
            type: String,
            require: true
        },
        email:{
            type: String,
        },
        role:{
            type: String,
        },

    },
    {
        timestamps: true
    }
);

// fire a function after
// registrantsSchema.post('save', function (doc,next){
//     console.log("new user was created")
//     next();
// })

// fire a function befora doc saved into db
registrantsSchema.pre('save', async function (next){
    const salt = await bcrypt.genSalt();
    this.password =  await bcrypt.hash(this.password, salt)
    next();
})

const Registrants = mongoose.model('Registrants', registrantsSchema);

module.exports = Registrants;