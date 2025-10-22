const jwt=require("jsonwebtoken");

function fetchAdmin(req,res,next){
    const token=req.header("auth-token");
    if(!token){
        return res.status(401).send({error:"Please authenticate using a valid token"});
    }
    try{
        const data=jwt.verify(token,process.env.JWT_SECRET);
        req.admin=data.admin;
        next();
    }catch(error){
        res.status(401).send({error:"Please authenticate using a valid token"});
    }
};

module.exports= {fetchAdmin};