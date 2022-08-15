const userModel = require('../models/User');
const getUsers = async (req,res)=>{
    try{
        const filterObj = {};
        if(req.query.user_type){
            filterObj.userType = req.query.user_type;
        }
        if(req.query.name){
            filterObj.name = {"$regex":  req.query.name,'$options':'i'}
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
module.exports = {
    getUsers
}
