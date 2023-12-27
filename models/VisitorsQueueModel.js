const mongoose = require('mongoose');
const { type } = require('os');

const VisitorsQueueSchema = mongoose.Schema(
    {
        id: {
            type: String,
            require: true
        },
    },
    {
        timestamps: true
    }
);

const VisitorsQueue = mongoose.model('VisitorsQueue', VisitorsQueueSchema);

module.exports = VisitorsQueue;