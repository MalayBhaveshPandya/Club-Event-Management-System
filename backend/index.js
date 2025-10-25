const connectToMongo=require("./db");
const express=require("express");
const dotenv=require('dotenv').config();
const cors=require('cors');
connectToMongo();

const app=express();
const port=3000;

app.use(cors());

app.use(express.json());
app.use(express.urlencoded({extended:true}));

app.get("/",(req,res)=>{
    res.send("I am root");
});

app.use("/api/admin",require("./routes/admin/admin"));
app.use("/api/student",require("./routes/student/student"));
app.use("/api/clubs",require("./routes/clubs/club"));


app.listen(port,()=>{
    console.log(`Server is running on port http://localhost:${port}`);
});