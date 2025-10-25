const mongoose=require("mongoose");

const connectToMongo=()=>{
    mongoose.connect(process.env.MONGO_URI)
    .then(()=>{
        console.log("Connected to MongoDB successfully");
        mongoose.set("strictPopulate", false);

    })
    .catch(err=>{
        console.error("Error connecting to MongoDB:", err);
    })
}

module.exports=connectToMongo;