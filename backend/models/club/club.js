const mongoose=require("mongoose");
const{Schema}=mongoose;
const ClubSchema=new Schema({
    name:{
        type:String,
        required:true,
        unique:true
    },
    description:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true
    },
    logo:{
        type:String,
        required:true
    },
    membersCount:{
        type:Number,
        default:0
    },
    isApproved:{
        type:Boolean,
        default:false
    },
    password:{
        type:String,
        required:true
    },
    isVerified:{
        type:Boolean,
        default:false
    }
})

const Club=mongoose.model("Club",ClubSchema);
module.exports=Club;