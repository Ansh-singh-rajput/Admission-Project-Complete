const mongoose = require('mongoose')
const liveUrl = 'mongodb+srv://ansh9754:ansh123@cluster0.kcjt9gf.mongodb.net/AdmissionPortal'
const localUrl = 'mongodb://127.0.0.1:27017/admission'


const connectDb=()=>{
    return mongoose.connect(liveUrl)
    .then(()=>{
        console.log("connected with mongoose");
    }).catch((err)=>{
        console.log(err);
    });  
};
module.exports = connectDb;
