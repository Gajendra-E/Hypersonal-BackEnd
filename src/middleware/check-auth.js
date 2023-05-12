var jwt = require('jsonwebtoken');
var db = require('../models');
require('dotenv').config();

module.exports = async (req, res, next)=> {
    try {
        // const headers = req.headers;    
        let token= await req.cookies['token']   
            if (token!==null&&token!==undefined) {
              
                const decoded = jwt.verify(token, process.env.JWT_PRIVATE_KEY);
               req.userData = decoded;
                if(Object.keys(decoded).length > 0){
                    let user_id=decoded.user_id
                    let fetchUser = await db.SuperUser.findOne({ where: { id: user_id}});
                    if(fetchUser === null){
                        res.redirect('/login');
                        // return res.status(401).json({
                        //     status: 'failed',
                        //     message: 'Auth failed'
                        // });
                    }
                    next(); 
               
                }else{
                    res.redirect('/login');
                    // return res.status(401).json({
                    //     status: 'failed',
                    //     message: 'Auth failed'
                    // });
                }
            }
            else {
                res.redirect('/login');
                // return res.status(401).json({
                //     status: 'failed',
                //     message: 'Auth failed'
                // });
            }
    }
    catch (error) {
        res.redirect('/login');
        // return res.status(401).json({
        //     status: 'failed',
        //     error:`${error}`,
        //     message: 'Auth failed'
        // });
    }            
}