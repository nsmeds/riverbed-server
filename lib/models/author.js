const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const schema = new Schema ({
    name: {
        type: String,
        required: [true, 'Author name required.']
    },
    posts: [{
        type: Schema.Types.ObjectId,
        ref: 'Post'
    }],
    bio: {
        type: String
    }
});

module.exports = mongoose.model('Author', schema);