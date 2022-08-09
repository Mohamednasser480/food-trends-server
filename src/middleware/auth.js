const jwt = require('jsonwebtoken');
const User = require('../models/User');

const auth = async (req,res,next) =>{
    try {
        const token = req.header('Authorization').replace('Bearer ','');
        const decoded = await jwt.verify(token, process.env.JWT_SEC);
        const user = await User.findOne({_id:decoded._id, 'tokens.token': token });
        if(!user) throw new Error();
        req.user = user;
        req.token = token;
        next();
    }catch (e){
        res.status(401).send({error:'please authenticate.'});
    }
}
module.exports = auth;