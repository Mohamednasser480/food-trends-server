const vendorAuth = async (req,res,next) =>{
    try {
        if(req.user.userType === 'delivery') next();
        else throw new Error();
    }catch (e){
        res.status(401).send({error:'authentication error!'});
    }
}
module.exports = vendorAuth;