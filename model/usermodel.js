const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please enter your name']
    },
    email: {
        type: String,
        required: [true, 'Enter an email'],
        unique: true,
        lowercase: true,
        validate: [validator.isEmail, 'Please enter a valid email.']
    },
    password: {
        type: String,
        required: [true, 'Enter a password'],
        minlength: 7,
        select: false
    },
    passwordChangedAt: Date
}, {timestamps: true});

userSchema.pre('save', async function(next) {
    if (!this.isModified('password')) return next();

    this.password = await bcrypt.hash(this.password, 12);
    next();
})

userSchema.methods.comparePasswordInDb = async function(password, dbpassword) {
    return await bcrypt.compare(password, dbpassword);
}

userSchema.methods.isPasswordChanged = async function(JWTTimestamp) {
    if(this.passwordChangedAt){
        const pswdChangedTimestamp = parseInt(this.passwordChangedAt.getTime() / 1000, 10);
        return JWTTimestamp > pswdChangedTimestamp;
    }
    return false;
}

const User = mongoose.model('User', userSchema);

module.exports = User;
