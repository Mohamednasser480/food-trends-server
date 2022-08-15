const userModel = require('../models/User');
const getUsers = async (req,res)=>{
    try{
        const filterObj = {};
        if(req.query.name){
            filterObj.name = {"$regex":  req.query.name,'$options':'i'}
        }
        if(req.query.verified === undefined &&  req.query.user_type )
            filterObj.userType = req.query.user_type;
        if(req.query.verified){
            filterObj.verified = req.query.verified;
            if(req.query.user_type === 'delivery' || req.query.user_type ==='vendor')
                filterObj.userType = req.query.user_type;
            else
                filterObj.userType = { $in: ['vendor','delivery'] };
        }
        const options = {
            limit: req.query.limit,
            skip:req.query.skip
        }
        const count = await userModel.find(filterObj,null).count();
        const users = await userModel.find(filterObj,null,options);
        if(!users) res.status(404).send({error:'users not found',code:404});
        res.send({data:users,count});
    }catch (e){
        res.send({error:e.message,code:400});
    }
}
const changeStatus = async (req,res)=>{
    try{
        const user = await userModel.findById(req.params.id);
        if(!user)res.status(404).send({error:'user not found',code:404});
        user.verified = req.body.verified;
        await user.save();
        res.send(user);
    }catch (e){
        res.status(400).send({error:e.message,code:400});
    }
}
module.exports = {
    getUsers,
    changeStatus
}
