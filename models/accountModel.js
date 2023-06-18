const mongoose = require('mongoose');
const { type } = require('os');

const accountSchema = mongoose.Schema(
    {
        id: {
            type: String,
            require: true
        },
        type:{
            type: String,
        },
        title:{
            type: String,
            require: true
        },
        coverimg:{
            type: String,
        },
        description:{
            trpe: String,
        }
    },
    {
        timestamps: true
    }
);

const Account = mongoose.model('Account', accountSchema);

module.exports = Account;