const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const schema = new Schema ({
    title: {
        type: String,
        required: [true, 'Title required.']
    },
    author: {
        type: Schema.Types.ObjectId,
        ref: 'Author'
    },
    issue: {
        type: Schema.Types.ObjectId,
        ref: 'Issue'
    },
    content: {
        type: String,
        required: [true, 'Content required.']
    },
    bio: {
        type: Schema.Types.ObjectId,
        ref: 'Author'
    }
});

module.exports = mongoose.model('Post', schema);