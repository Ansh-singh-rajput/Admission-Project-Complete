const express=require('express')
const FrontController = require('../controllers/FrontController')
const route=express.Router()
const checkUserAuth=require('../middleware/auth')
const CourseController = require('../controllers/CourseController')
const AdminController = require('../controllers/AdminController')
const ContactController = require('../controllers/ContactController');
const adminRole = require('../middleware/adminRole')
const isLogin = require('../middleware/isLogin')








route.get('/',isLogin,FrontController.login)
route.get('/register',FrontController.register)
route.get('/home',checkUserAuth,FrontController.home)
route.get('/about', checkUserAuth, FrontController.about)
route.get('/contact', checkUserAuth,FrontController.contact)
route.post('/userinsert',FrontController.userinsert)

route.post('/verifyLogin',FrontController.verifyLogin)
route.get('/logout',FrontController.logout)

//profile update
route.get('/profile',checkUserAuth,FrontController.profile)
route.post('/updateprofile',checkUserAuth,FrontController.updateprofile)
route.post('/changePassword',checkUserAuth,FrontController.changePassword)


// admin
route.get('/admin/dashboard',checkUserAuth, adminRole('admin'), AdminController.dashboard)
route.post('/update_status/:id',checkUserAuth, AdminController.update_status)



//course Route
route.post("/course_insert",checkUserAuth,CourseController.courseInsert)
route.get("/course_display",checkUserAuth,CourseController.courseDisplay)
route.get("/courseView/:id",checkUserAuth,CourseController.courseView)
route.get("/courseEdit/:id",checkUserAuth,CourseController.courseEdit)
route.post("/courseUpdate/:id",checkUserAuth,CourseController.courseUpdate)
route.get("/courseDelete/:id",checkUserAuth,CourseController.courseDelete)

//contact Route
route.post('/contactUs/:id',checkUserAuth ,ContactController.contactUs)

//for forget password
route.post('/forgot_Password',FrontController.forgetPasswordVerify)
route.get('/reset-password',FrontController.resetPassword)
route.post('/reset_Password1',FrontController.reset_Password1)

route.get('/verify',FrontController.verify)

module.exports=route