const mongoose = require('mongoose');

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
        },
        viewcount:{
            type: Number,
        }
    },
    {
        timestamps: true
    }
);

repositorySchema.methods.incrementViewCount = function() {
    this.viewcount += 1;
    const updateObject = { viewcount: this.viewcount };
    const options = { new: true, timestamps: false };
    return this.constructor.findByIdAndUpdate(this._id, updateObject, options);
};

const Repository = mongoose.model('Repository', repositorySchema);

module.exports = Repository;
