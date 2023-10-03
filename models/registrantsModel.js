const mongoose = require('mongoose');
const { type } = require('os');

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

    },
    {
        timestamps: true
    }
);

const Registrants = mongoose.model('Registrants', registrantsSchema);

module.exports = Registrants;