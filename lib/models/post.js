const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const schema = new Schema ({
    title: {
        type: String,
        // required: [true, 'Title required.']
    },
    author: {
        type: Schema.Types.ObjectId,
        ref: 'Author'
    },
    issue: {
        type: Schema.Types.ObjectId,
        ref: 'Issue'
    },
    text: {
        type: String,
        // required: [true, 'Text content required.']
    },
    bio: {
        type: Schema.Types.ObjectId,
        ref: 'Author'
    }
});

module.exports = mongoose.model('Post', schema);