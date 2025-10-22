const mongoose=require("mongoose");
const {Schema}=mongoose;

const otpVerification=new Schema({
    userId:{
        type:String
    },
    otp:{
        type:String
    },
    createdAt:{
        type:Date
    },
    expiresAt:{
        type:Date
    }
});

const otpV=mongoose.model("otpVerification",otpVerification);

module.exports=otpV;
