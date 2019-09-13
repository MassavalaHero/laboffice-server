const Joi = require('joi');
const HttpStatus = require('http-status-codes');
const bcrypt = require('bcryptjs');
const Helpers = require('../Helpers/helpers');

const jwt = require('jsonwebtoken');
const dbConfig = require('../config/secret');

const User = require('../models/userModel');

module.exports = {
  async CreateUser(req, res) {
    // console.log(req.body); //to test
    const schema = Joi.object().keys({
      username: Joi.string()
        .min(5)
        .max(40)
        .required(),
      phoneno: Joi.number().required(),
      email: Joi.string()
        .email()
        .min(5)
        .required(),
      course: Joi.string()
        .min(5)
        .max(50)
        .required(),
      password: Joi.string()
        .min(2)
        .max(10)
        .required()
    });
    const { error, value } = Joi.validate(req.body, schema);
    if (error && error.details) {
      return res
        .status(HttpStatus.BAD_REQUEST)
        .json({ message: error.details });
    }

    const userEmail = await User.findOne({
      email: Helpers.lowerCase(req.body.email)
    });
    if (userEmail) {
      return res
        .status(HttpStatus.CONFLICT)
        .json({ message: 'Email already exist' });
    }

    const userName = await User.findOne({
      username: Helpers.firstUpper(req.body.username)
    });
    if (userName) {
      return res
        .status(HttpStatus.CONFLICT)
        .json({ message: 'Username already exist' });
    }
    return bcrypt.hash(value.password, 10, (err, hash) => {
      if (err) {
        return res
          .status(HttpStatus.BAD_REQUEST)
          .json({ message: 'Error hashing password' });
      }
      const body = {
        username: Helpers.firstUpper(value.username),
        email: Helpers.lowerCase(value.email),
        phoneno: value.phoneno,
        course: Helpers.lowerCase(value.course),
        password: hash
      };
      User.create(body)
        .then(user => {
          const token = jwt.sign({ data: user }, dbConfig.secret, {
            expiresIn: '5h'
          });
          res.cookie('auth', token);
          res
            .status(HttpStatus.CREATED)
            .json({ message: 'User created successfully', user, token });
        })
        .catch(err => {
          res
            .status(HttpStatus.INTERNAL_SERVER_ERROR)
            .json({ message: 'Error occured' });
        });
    });
  },

  async LoginUser(req, res) {
    //check if there's no username and password entered in the login form. If not, the error message 'no empty field allowed' is displayed.
    if (!req.body.username || !req.body.password) {
      return res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ message: 'No empty field allowed' });
    }

    //In case the login form is filled, We check if the data exist in the database
    await User.findOne({ username: Helpers.firstUpper(req.body.username) })
      .then(user => {
        //If the user isn't available in the database, the error message 'Username not found' is displayed.
        if (!user) {
          return res
            .status(HttpStatus.NOT_FOUND)
            .json({ message: 'Username not found' });
        }
        //In case the username is found in database, we compare the password entered with the one saved in the database.
        return bcrypt.compare(req.body.password, user.password).then(result => {
          //If there's no result , passwords don't match and the error message 'Password is incorrect' is displayed.
          if (!result) {
            return res
              .status(HttpStatus.INTERNAL_SERVER_ERROR)
              .json({ message: 'Passowrd is incorrect' });
          }

          //If there's a match, we sign the token, pass the user object, set the cookie and return the status 'OK'!
          const token = jwt.sign({ data: user }, dbConfig.secret, {
            expiresIn: '5h'
          });
          res.cookie('auth', token);
          return res
            .status(HttpStatus.OK)
            .json({ message: 'Login successful', user, token });
        });
      })
      //If there's an error , the error mesasge 'Error Occured' is displayed.
      .catch(err => {
        return res
          .status(HttpStatus.INTERNAL_SERVER_ERROR)
          .json({ message: 'Error Occured' });
      });
  }
};
