const jwt = require('jsonwebtoken')

const authRoles = (roles) =>{//roles admin data and user data
    return(req,res,next) =>{
        //console.log(req.user.role)
        if (!roles.includes(req.userData.role)){
            req.flash('error','Unauthorised user please Login')
            res.redirect('/')
        }
        next();
    }

}
module.exports=authRoles