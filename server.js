require('dotenv').config();
const express  = require('express');
const  app = express();
// const path = require("path");

const {dbConnect} = require('./config/dbConnect');


//APIS's
const authAPI = require('./apis/authAPI')
const emailAPI = require('./apis/emailAPI')

//Connecting to  DB
dbConnect();
app.use(express.json());

// app.use(express.static(path.join(__dirname,"/build")));

//routes
// app.get("/",(req,res)=>{
//     res.send(path.join(__dirname,"/build/index.html"));
// })

 // apis
app.use('/api/auth',authAPI);
app.use('/api/email',emailAPI);




//PORT
const port = process.env.PORT || 5000;


app.listen(port,(req,res)=>{
    console.log(`server is running in the port ${port}`);
})