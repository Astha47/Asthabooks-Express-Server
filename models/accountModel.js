const mongoose = require('mongoose');
const { type } = require('os');
const bcrypt = require('bcrypt');

const accountSchema = mongoose.Schema(
    {
        username:{
            type: String,
            require: true
        },
        password:{
            type: String,
            require: true
        },
        token:{
            type: String,
            require: true
        },
        email:{
            type: String,
        },

    },
    {
        timestamps: true
    }
);

// static method to login user
accountSchema.statics.login = async function(email, password) {
    const user = await this.findOne({ email });
    if (user){
        const auth = await bcrypt.compare(password, user.password);
        if (auth) {
            return user.token;
        }
        throw Error("Incorrect password")
    }
    throw Error("Incorrect email")    
}

const Account = mongoose.model('Account', accountSchema);

module.exports = Account;