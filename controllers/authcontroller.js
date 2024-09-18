const User = require('../model/usermodel');
const jwt = require('jsonwebtoken');

const signToken = id => {
    return jwt.sign({id}, process.env.SECRET_STR, {expiresIn: process.env.LOGIN_EXPIRES})
}

exports.signup = async (req, res) => {
    try{
        const newUser = await User.create(req.body);

        const token = signToken(newUser._id);
        res.cookie('jwt', token, {
            maxAge: process.env.LOGIN_EXPIRES,
            httpOnly: true,
            secure: false,
        });
        res.status(201).json({
            status: 'success',
            token
        })
    }catch(err) {
        res.status(400).json({
            status: 'fail',
            message: err.message
        })
    }
}

exports.login = async(req, res) =>{
    try{
        const email = req.body.email;
        const password = req.body.password;

        if(!email || !password) {
            throw new Error('Please provide email ID & Password to login', {statusCode: 400});
        }

        const user = await User.findOne({email}).select('password');

        if(!user || !await user.comparePasswordInDb(password, user.password)){
            throw new Error("Incorrect email or password", {statusCode: 400});
        }

        const token = signToken(user._id);
        req.user = user;
        res.cookie('jwt', token, {
            maxAge: process.env.LOGIN_EXPIRES,
            httpOnly: true,
            secure: false,
        });
        res.status(200).json({
            status: 'success',
            token
        })
    }catch(err) {
        res.status(400).json({
            status:'fail',
            message: err.message
        })
    }   
}
