const UserModel = require('../models/user')
const nodemailer = require("nodemailer");
const randomstring = require("randomstring");

// To Secure Password
const cloudinary = require("cloudinary")
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const CourseModel = require('../models/course');

cloudinary.config({
    cloud_name: 'dnzs5c9q3',
    api_key: '661477146633168',
    api_secret: 'QyINe3Q4WivgC2eTmlsZoYwSDRc'
});

class FrontController {
    //static method
    static login = async (req, res) => {
        try {
            //res.send("login page")
            res.render('login', { message: req.flash('success'), msg: req.flash('error') });
        } catch (error) {
            console.log(error);
        }
    }
    static register = async (req, res) => {
        try {
            //res.send("login page")
            res.render('register', { message: req.flash('error') });
        } catch (error) {
            console.log(error);
        }
    }
    static home = async (req, res) => {
        ;
        try {
            const { name, image,email,id } = req.userData
            const btech= await CourseModel.findOne({user_id:id,course:"btech"})
            const bca= await CourseModel.findOne({user_id:id,course:"bca"})
            const mca= await CourseModel.findOne({user_id:id,course:"mca"})
            res.render("home", { n: name, i: image,e:email,btech:btech,bca:bca,mca:mca })
        } catch {
            console.log(error)
        }
    }
    static about = async (req, res) => {
        try {
            const { name, image } = req.userData
            res.render("about", { n: name, i: image })
        } catch {
            console.log(error)
        }
    }
    static contact = async (req, res) => {
        try{
            const {name , email , image , id} = req.userData;
            const data = await CourseModel.findOne({user_id:id})
            // console.log(data);
            res.render('contact',{n:name , e:email , d:data , i:image});
        }catch(err){
            console.log(err);
        }
    }
    static userinsert = async (req, res) => {
        try {

            //console.log(req.files.image)
            //code for upload image on cloudinary
            const file = req.files.image
            const imageUpload = await cloudinary.uploader.upload(file.tempFilePath, {
                folder: 'userprofile'
            })
            //console.log(imageUpload)
            const { n, e, p, cp } = req.body;
            const user = await UserModel.findOne({ email: e })
            // console.log(user)
            if (user) {
                req.flash('error', 'Email Already Exists.')
                res.redirect('/register');
            } else {
                if (n && e && p && cp) {
                    if (p == cp) {
                        const hashPassword = await bcrypt.hash(p, 10);
                        const result = new UserModel({
                            name: n,
                            email: e,
                            password: hashPassword,
                            image: {
                                public_id: imageUpload.public_id,
                                url: imageUpload.secure_url
                            }
                        })
                        //To save data
                        await result.save();

                        //To redirect to login page
                        req.flash('success', 'Successfully Registered , Please Login .')
                        res.redirect('/');
                    } else {
                        req.flash('error', 'Password & Confirm Password must be Same.')
                        res.redirect('/register');
                    }
                } else {
                    req.flash('error', 'All Fields are Required.')
                    res.redirect('/register');
                }
            }
        } catch(error) {
            console.log(error)
        }
    }
    static verifyLogin = async (req, res) => {
        try {
            const { email, password } = req.body
            // console.log(req.body)
            const user = await UserModel.findOne({ email: email })
            if (user != null) {
                const isMatch = await bcrypt.compare(password, user.password)
                if (isMatch) {
                    //admin login
                    if(user.role ==='admin')
                    {
                         //to generate login
                    const token = jwt.sign({ ID: user.id }, 'guptchabi@123456');
                    //console.log(token)
                    res.cookie('token', token)
                    res.redirect('/admin/dashboard')
                    }

                    else{
                    //to generate token
                    const token = jwt.sign({ ID: user.id }, 'guptchabi@123456');
                    //console.log(token)
                    res.cookie('token', token)
                    res.redirect('/home')
                    }
                } else {
                    req.flash('error', 'Email or password is not valid.')
                    res.redirect('/');
                }
            } else {
                req.flash('error', 'You are not a registered user.')
                res.redirect('/');
            }
        }
        catch (error) {
            console.log(error);
        }
    }
    static logout = async (req, res) => {
        try {
            res.clearCookie('token'); //clearcookie--->token ko clear krne k lie
            res.redirect('/')
        } catch {
            console.log(error)
        }
    }

    static profile = async (req, res) => {
        try {
           const {name,image,email,id}= req.userData
           res.render("profile",{n:name, i:image,e:email})
        } catch {
            console.log(error)
        }
    }
    static updateprofile = async (req, res) => {
        
        try {
            const { id } = req.userData
            const {name,email} =req.body
            if (req.files) {
                const user = await UserModel.findById(id)
                const imageID = user.image.public_id
                //console.log(imageID)

                //deleting image from Cloudinary
                await cloudinary.uploader.destroy(imageID)
                //new image update
                const imagefile = req.files.image
                const imageupload = await cloudinary.uploader.upload(imagefile.tempFilePath, {
                    folder: 'userprofile'
                })
                var data = {
                    name: name,
                    email: email,
                    image: {
                        public_id: imageupload.public_id,
                        url: imageupload.secure_url
                    }
                }
            } else {
                var data = {
                    name: name,
                    email: email,
                    
                }
            }
            await UserModel.findByIdAndUpdate(id, data)
            req.flash('success', "Update Profile successfully")
            res.redirect('/profile')
            
            
        } catch(error) {
            console.log(error)
        }
    }
    static changePassword = async (req, res) => {
        
        try {
            const {id } = req.userData
            //console.log(req.body)
            const {op,np,cp} =req.body
            if (op && np && cp) {
                const user = await UserModel.findById(id)
                const isMatched = await bcrypt.compare(op, user.password)
                //console.log(isMatched)
                if (!isMatched) {
                    req.flash('error', 'Current password is incorrect ')
                    res.redirect('/profile')
                } else {
                    if (np != cp) {
                        req.flash('error', 'Password does not match')
                        res.redirect('/profile')
                    } else {
                        const newHashPassword = await bcrypt.hash(np, 10)
                        await UserModel.findByIdAndUpdate(id, {
                            password: newHashPassword
                        })
                        req.flash('success', 'Password Updated successfully ')
                        res.redirect('/')
                    }
                }
            } else {
                req.flash('error', 'ALL fields are required ')
                res.redirect('/profile')
            }


           
        } catch(error) {
            console.log(error)
        }
    }

    //forget password
    static forgetPasswordVerify = async (req, res) => {
        try {
          const { email } = req.body;
          const userData = await UserModel.findOne({ email: email });
          //console.log(userData)
          if (userData) {
            const randomString = randomstring.generate();
            await UserModel.updateOne(
              { email: email },
              { $set: { token: randomString } }
            );
            this.sendEmail(userData.name, userData.email, randomString);
            req.flash("success", "Plz Check Your mail to reset Your Password!");
            res.redirect("/");
          } else {
            req.flash("error", "You are not a registered Email");
            res.redirect("/");
          }
        } catch (error) {
          console.log(error);
        }
      }

      static sendEmail = async (name, email, token) => {
        // console.log(name,email,status,comment)
        // connenct with the smtp server
    
        let transporter = await nodemailer.createTransport({
          host: "smtp.gmail.com",
          port: 587,
    
          auth: {
            user: "ansh9754@gmail.com",
            pass: "weffigpoctaclimg",
          },
        });
        let info = await transporter.sendMail({
          from: "test@gmail.com", // sender address
          to: email, // list of receivers
          subject: "Reset Password", // Subject line
          text: "heelo", // plain text body
          html:
            "<p>Hii " +
            name +
            ',Please click here to <a href="http://localhost:3000/reset-password?token=' +
            token +
            '">Reset</a>Your Password.',
        });
      };
    



}
module.exports = FrontController