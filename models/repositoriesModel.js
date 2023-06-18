const mongoose = require('mongoose');
const { type } = require('os');

const repositorySchema = mongoose.Schema(
    {
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
            type: String,
        },
        url:{
            type: String,
        }
    },
    {
        timestamps: true
    }
);

const Repository = mongoose.model('Repository', repositorySchema);

module.exports = Repository;