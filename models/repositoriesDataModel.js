const mongoose = require('mongoose');
const { type } = require('os');

const repositoryDataSchema = mongoose.Schema(
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
        shortdescription:{
            type: String,
        },
        longdescription:{
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

const RepositoryData = mongoose.model('RepositoryData', repositoryDataSchema);

module.exports = RepositoryData;