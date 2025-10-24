const jwt=require("jsonwebtoken");

function fetchClub(req,res,next){
    const authHeader=req.header("Authorization");
    const token=authHeader && authHeader.split(" ")[1];
    if(!token){
        return res.status(401).send({error:"Please authenticate using a valid token"});
    }
    try{
        const data=jwt.verify(token,process.env.JWT_SECRET);
        req.club=data.club;
        next();
    }catch(error){
        res.status(401).send({error:"Please authenticate using a valid token"});
    }
};

module.exports= {fetchClub};