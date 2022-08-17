const adminAuth = async (req,res,next) =>{
    try {
        if(req.user.userType === 'admin') next();
        else throw new Error();
    }catch (e){
        res.status(401).send({error:'authentication error!',code:401});
    }
}
module.exports = adminAuth;