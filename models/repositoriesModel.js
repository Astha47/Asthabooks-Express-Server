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
        genre:{
            type: [String]
        },
        author:{
            type: String,
            require: true
        },
        imgbanner:{
            type: String,
        },
        imgcover:{
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

const Repository = mongoose.model('Repository', repositorySchema);

module.exports = Repository;