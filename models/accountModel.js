const mongoose = require('mongoose');
const { type } = require('os');

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
        email:{
            type: String,
        },

    },
    {
        timestamps: true
    }
);

const Account = mongoose.model('Account', accountSchema);

module.exports = Account;