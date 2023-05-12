var express = require('express');
var router = express.Router();
var db = require('../models');
var {registerUser} =require('../helpers/userHelpers');
var security = require('../helpers/security');
var checkAuth= require('../middleware/check-auth')
var Email = require('../../reset-password-emails.js');
var Emails = require('../../emails.js');


/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});
router.get('/base-users', async function(req, res, next) {
  try{
 let fetchBaseUser =  await db.BaseUser.findAll();

 res.status(200).json({
  'status':'success',
  'payload':fetchBaseUser,
  'message':'baseuser fetched successfully'
})

  }
  catch(error){
    console.log("Error=========>"+error)
    res.status(500).json({
       'status':'failed',
       'payload':{},
       'message':error
    })
  }
});

router.post('/base-user', async function(req, res) {
 
  try{
    let {first_name,last_name,email,password,terms_and_conditions}=req.body
    let baseuser={}
    baseuser.first_name=first_name,
    baseuser.last_name=last_name,
    baseuser.email=email,
    baseuser.password=password,
    baseuser.terms_and_conditions=terms_and_conditions

let newBaseUser = await registerUser(baseuser);  

if(newBaseUser=="user already exist"){
 return res.json({
    'status':'failed',
    'payload':{},
    'message':newBaseUser
 })

 

 
}
else{
res.status(200).json({
    'status':'success',
    'payload':newBaseUser,
    'message':'baseuser created successfully'
})
}
}
catch(error){
console.log("Error=========>"+error)
res.status(500).json({
   'status':'failed',
   'payload':{},
   'message':error
})
}
});


router.post('/login', async function(req, res) {

  try {
    const { email,password } = req.body;

    let  fetchBaseUser = await db.BaseUser.findOne({
      where:{
          email:email
      }
  })
   
    if(fetchBaseUser === null){
   
      return res.json({
        status: 'failed',
        payload: null,
        message: 'Error while fetching BaseUser'
    });
 
    }
   else{
    let isExistUser = await db.BaseUser.authenticate(fetchBaseUser, req.body);
  
    if(isExistUser !== null){
   
        let userObj = {};
        userObj.user_id = fetchBaseUser.id;
        userObj.first_name = fetchBaseUser.first_name;
        userObj.last_name = fetchBaseUser.last_name;
        userObj.email = fetchBaseUser.email;
        let name=fetchBaseUser.first_name+" "+fetchBaseUser.last_name

        Emails.send_email(name,email);

        //console.log("------------userObj--------------------",JSON.stringify(userObj))
       
       // let token = jwt.sign(userObj, process.env.JWT_PRIVATE_KEY, { expiresIn: '1h' });
        // let token = jwt.sign(userObj, process.env.JWT_PRIVATE_KEY);
  
      // const token = JSON.parse(window.localStorage.getItem('token'));

      return res.status(200).json({
        status: 'success',
        payload: userObj,
        message: 'user logged in sucessfully '
    });
  
    }
    
    else{
      return res.json({
        status: 'failed',
        payload: null,
        message: 'email or password wrong'
    });
    }
   }
  
    
  } catch (error) {
    console.log(error)
    
    console.log("Error at BaseUser login method- Post /:service-name:" + error);
        res.status(500).json({
            status: 'failed',
            message: error
        });
  }
  
  });


  router.post('/forgot-password', async function (req, res) {

    var userEmail = req.body.email
    try {
    let fetchBaseUser = await db.BaseUser.findOne({
          where:{
              email:userEmail
          }
      })
     
      if(fetchBaseUser!==null){
        var userObj = {};
        userObj.id = fetchBaseUser.id;
        let publicStr	=	await security.encrypt(JSON.stringify(userObj))

    
          var subject = "Forgot Password"
          var userName =fetchBaseUser.first_name;
          var htmlUrl = `${process.env.VERIFY_ACCOUNT_URL}${publicStr}`

         // var htmlUrl = "http://localhost:3000" + '/change-password/' + publicStr;
  
          Email.send_email_change_password(userEmail, subject, userName, htmlUrl);
         
          res.json({
            status: "success",			
            message: "Verification email sent to your registered email"
          });
        
        }
        else{
       
          res.json({
            response: "failed",
            data: {},
            message: "Error Occurred: "
          });
        }
    }

    catch (error) {
    
		res.json({
			response: "failed",
			data: {},
			message: "Error Occurred: " + error
		});
	}  
      
  })
  
  
  router.post('/change-password', async function (req, res) {
    
    try {
    var { user_id,password }  = req.body;
  
    let queryString = await security.decrypt(user_id);
  
      if (queryString !== null) {
        
        let id = JSON.parse(queryString).id

      
              let  fetchBaseUser = await db.BaseUser.findOne({
                where:{
                    id:id
                }
              })
      
              if(fetchBaseUser !== null){
      
                let updateSuperUser = await db.BaseUser.update({
                  first_name:fetchBaseUser.first_name,
                  last_name:fetchBaseUser.last_name,
                  email:fetchBaseUser.email,
                  password: password !== undefined && password !== null ? password : null,
                  terms_and_conditions:fetchBaseUser.terms_and_conditions,
                  status: 'ACTIVE'
      
              }, {
                  where: {
                      id:fetchBaseUser.id
                  },
                  //returning: true
              });
              res.json({
                status: "success",
                message: "Password has been reset successfully"
              });
              }
              else{
                return res.json({
                  response: "failed",
                  data: {},
                  message: "UnAuthorized Access"
                });
              }
            }   
           
          }
          catch (error) {
            res.json({
              response: "failed",
              data: {},
              message: "Error Occurred: " + error
            });
          }
  });
  
module.exports = router;
