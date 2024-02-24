const mongoose = require('mongoose')

const connectDb=()=>{
    return mongoose.connect('mongodb://127.0.0.1:27017/admission-portal')
    .then(()=>{
        console.log("connected with mongoose");
    }).catch((err)=>{
        console.log(err);
    });  
};
module.exports = connectDb;
