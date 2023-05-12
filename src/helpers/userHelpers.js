var db = require('../models');

module.exports ={
    registerUser: (body)=> {
        return new Promise(async (resolve, reject)=> {
            try {
                let {first_name,last_name, email, password,terms_and_conditions } = body;
               
                let  fetchBaseUser = await db.BaseUser.findOne({
                    where:{
                        email:email
                    }
                })
                if(fetchBaseUser!==null){
                    resolve("user already exist");
                }

                // let fetchRole = await db.Role.findOne({
                //     where:{
                //         code:user_type
                //     }
                // })
                // if (fetchRole === null) {
                //     reject("Role does not exist");
                // }
               else{
                let newBaseUser = await db.BaseUser.create({
                    first_name:first_name,
                    last_name:last_name,
                    email: email,
                    password: password !== undefined && password !== null ? password : null,
                    terms_and_conditions:terms_and_conditions,
                    status: 'ACTIVE'
                });
                
                // await db.UserRole.create({
                //     role_id: fetchRole.id,
                //     user_id: newUser.id,
                //     status:"ACTIVE"
                // });
                // await db.UserProfile.create({
                //     user_id: newUser.id,
                //     first_name: first_name,
                //     last_name: last_name,
                //     email: email,
                //     date_of_birth:date_of_birth,
                //     gender:gender,
                //     status:"ACTIVE"
                // });

                let fetchCreatedBaseUser = await db.BaseUser.findOne({
                    where: {
                        id: newBaseUser.id
                    },
                    // include: [
                    //     {
                    //         model: db.UserRole,
                    //         as: 'userRole',
                    //     },
                    //     {
                    //         model: db.UserProfile,
                    //         as: 'userProfile',
                    //     }
                    // ]
                });
                resolve(fetchCreatedBaseUser);
            }
            } catch (error) {
                console.log('Error at register baseuser function => '+error);
                reject(`Error ----------->: ${error}`);
            }
        });
    },
}