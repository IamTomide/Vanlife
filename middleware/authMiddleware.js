const jwt = require('jsonwebtoken');
const util = require('util');
const User = require('../model/usermodel');

exports.protect = async (req, res, next) => {
    try{
        const token = req.cookies?.jwt;
        if (!token) {
            throw new Error('You are not logged in!', {statusCode: 401})
        }
        const decodedToken = await util.promisify(jwt.verify)(token, process.env.SECRET_STR);
        
        const user = await User.findById(decodedToken.id);

        if (!user) {
            throw new Error('User does not exist ', {statusCode: 401})
        }

        const passwordChanged = await user.isPasswordChanged(decodedToken.iat)
        if (passwordChanged) {
            throw new Error('The password has been changed recently, Please login again', {statusCode: 401})
        }

        req.user = user;
        next();
    }catch(err){
        console.log({err})
        res.redirect('/login');
    }
}