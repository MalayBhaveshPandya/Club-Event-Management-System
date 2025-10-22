const mongoose=require("mongoose");
const {Schema}=mongoose;
const StuSchema=new Schema({
    name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true,
        unique:true
    },
    sapid:{
        type: Number,
        required:true,
        unique:true
    },
    department:{
        type:String,
        required:true
    },
    division:{
        type:String,
        required:true
    },
    rollno:{
        type:String,
        required:true,
        unique:true
    },
    year:{
        type:Number,
        required:true,
        max:4,
        min:1
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

const Student=mongoose.model("student",StuSchema);
module.exports=Student;