const mongoose = require('mongoose');
const { type } = require('os');

const repositorySchema = mongoose.Schema(
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

const Repository = mongoose.model('Repository', repositorySchema);

module.exports = Repository;