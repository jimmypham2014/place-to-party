'use strict';
const {Model, Validator} = require('sequelize');
const bcrypt = require('bcryptjs');

module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    toSafeObject() {
      const { id, username, email } = this; // context will be the User instance
      return { id, username, email };
    }
    
//Define an instance method `validatePassword` in the `user.js`
// model file. It should accept a `password` string and return `true` if there is a
// match with the `User` instance's `hashedPassword`. If there is no match, it
// should return `false`.
    
    validatePassword(password) {
      return bcrypt.compareSync(password, this.hashedPassword.toString());
    }
    
    
    //Define a static method `getCurrentUserById` in the `user.js` model file
    //that accepts an `id`. It should use the `currentUser` scope to return a
    //`User` with that `id`.
    static getCurrentUserById(id) {
      return User.scope("currentUser").findByPk(id);
    }

    static async login({ credential, password }) {
      const { Op } = require('sequelize');
      const user = await User.scope('loginUser').findOne({
        where: {
          [Op.or]: {
            username: credential,
            email: credential
          }
        }
      });
      if (user && user.validatePassword(password)) {
        return await User.scope('currentUser').findByPk(user.id);
      }
    }

    static async signup({ username, email, password }) {
      const hashedPassword = bcrypt.hashSync(password);
      const user = await User.create({
        username,
        email,
        hashedPassword
      });
      return await User.scope('currentUser').findByPk(user.id);
    }

    static associate(models) {
      // define association here
    }
  }
  User.init({
    username: {
      type:DataTypes.STRING,
      allowNull:false,
      unique:true,
      validate:{
        len: [4,30],
        isNotEmail(value){
          if(Validator.isEmail(value)){
            throw new Error('Cannot be an email.');
          }
        }
      }
    },
    email: {
      type:DataTypes.STRING,
      allowNull:false,
      validate:{
        len: [3,256],
        isEmail: true
      }
    },
    hashedPassword: {
      type:DataTypes.STRING.BINARY,
      allowNull:false,
      validate:{
        len: [60,60]
      }
    }
  }, {
    sequelize,
    modelName: 'User',
    defaultScope:{
      defaultScope: {
        attributes: {
          exclude: ["hashedPassword", "email", "createdAt", "updatedAt"]
        }
      },
      scopes: {
        currentUser: {
          attributes: { exclude: ["hashedPassword"] }
        },
        loginUser: {
          attributes: {}
        }
      }
    }
  });
  return User;

};
