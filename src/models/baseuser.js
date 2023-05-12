'use strict';
const {
  Model
} = require('sequelize');
const bcrypt = require('bcryptjs');
module.exports = (sequelize, DataTypes) => {
  class BaseUser extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }

    static authenticate (baseuser, body){
      return new Promise(function (resolve, reject) {
        if (typeof body.password !== 'string') {
          resolve(null)
        }
        
        try {
          if (!baseuser || baseuser.get('hashed_password') === null || !bcrypt.compareSync(body.password, baseuser.get('hashed_password'))) {
            resolve(null);
          }
  
          resolve(baseuser);
  
        } catch (error) {
          resolve(null);
        }
      });
    }
  }
  BaseUser.init({
    first_name: {
      type:DataTypes.STRING,
      allowNull: false,
    },
    last_name:{
      type:DataTypes.STRING,
      allowNull: false,
    },
    email: {
     type:DataTypes.STRING,
     allowNull: false,
    },
    password: {
      type: DataTypes.VIRTUAL,
      allowNull: true,
      set: function (value) {
        if (value !== null) {
          var salt = bcrypt.genSaltSync(10);
          var hashedPassword = bcrypt.hashSync(value, salt);
          this.setDataValue('password', value);
          this.setDataValue('salt', salt);
          this.setDataValue('hashed_password', hashedPassword);
        }
      }
    },
    salt:{
      type:DataTypes.STRING,
      allowNull: false,
    },
    hashed_password:{
      type:DataTypes.STRING,
      allowNull: false,
    },
    terms_and_conditions:{
      type:DataTypes.BOOLEAN,
      allowNull: false,
    },
    status:{
      type:DataTypes.BOOLEAN,
      allowNull: true,
    }
  }, {
    sequelize,
    modelName: 'BaseUser',
  });
  return BaseUser;
};