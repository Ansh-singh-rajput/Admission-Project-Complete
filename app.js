const express = require('express')
const app =express()
const port =4000
const web=require("./routes/web")

const cookieparser =require('cookie-parser')
app.use(cookieparser())

//file upload
const fileUpload=require('express-fileupload')
//tempfiles uploaderz

app.use(fileUpload({useTempFiles:true}))

//connect flash and sessions
const session = require('express-session')
const flash = require('connect-flash');
//messages
app.use(session({
    secret: 'secret',
    cookie: { maxAge: 60000 },
    resave: false,
    saveUninitialized: false,
  }));
//Flash messages
app.use(flash());

//data get krne k lie
app.use(express.urlencoded({extended:false}))

const connectDb =require("./db/dbcon.js")
//connection database
connectDb()

// for linking css and image
app.use(express.static('public'))


//template engines(html css)
app.set('view engine', 'ejs')




//router load http://localhost:4000/ (/)
app.use('/' ,web)


//server create
app.listen(port,()=>{
    console.log('listening on port');
});
