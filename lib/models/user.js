const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcrypt = require('bcryptjs');

const userSchema = new Schema ({
    username: {
        type: String,
        required: [true, 'Username required.']
    },
    hash: {
        type: String,
        required: [true, 'Password required.']
    },
    roles: [{
        type: String,
        enum: ['admin']
    }]
    // admin: Boolean
});

userSchema.virtual('password').set(function(password) {
    this.hash = bcrypt.hashSync(password, 8);
});

userSchema.methods.comparePassword = function(password) {
    return bcrypt.compareSync(password, this.hash);
};

module.exports = mongoose.model('User', userSchema);