const mongoose =require('mongoose');

const TeacherSchema= new mongoose.Schema({
    name:{
        type:String,
        Required:true,
    },
    email:{
        type:String,
        Required:true,
    }
},{timestamps:true})//jb ham insert krege to 2 field dega createdadd -->date time btyegi or update

const TeacherModel=mongoose.model('teacher',TeacherSchema)
module.exports=TeacherModel