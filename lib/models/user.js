const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const schema = new Schema ({
    username: {
        type: String,
        required: [true, 'Username required.']
    },
    password: {
        type: String,
        required: [true, 'Password required.']
    },
    admin: Boolean
});

module.exports = mongoose.model('User', schema);