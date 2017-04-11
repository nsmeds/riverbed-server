const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const schema = new Schema ({
    title: {
        type: String,
        required: [true, 'Issue requires a title.']
    },
    posts: [{
        type: Schema.Types.ObjectId,
        ref: 'Post'
    }],
    isCurrentIssue: {
        type: Boolean,
        default: false
    }
});

module.exports = mongoose.model('Issue', schema);