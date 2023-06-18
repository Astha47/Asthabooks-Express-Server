const mongoose = require('mongoose');
const { type } = require('os');

const typeResSchema = mongoose.Schema(
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

const TypeRes = mongoose.model('TypeRes', typeResSchema);

module.exports = TypeRes;