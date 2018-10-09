const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const secret = 'secret';
const User = require('../models/userModel');
const crypto = require('crypto');
const bcrypt = require('bcrypt-nodejs');
const mail = require('../../send_mail.js');

//create an user
exports.create = function (req, res) {
  User.findOne({
    "email": req.body.email
  })
    .then((singleUser) => {
      if (singleUser) {
        console.log('User already exists with this Email ID ' + req.body.email);
        res.status(404).send({
          "message": "User already exists with this Email ID " + req.body.email
        });
      } else {
        var newUser = new User(req.body);
        newUser.passcode = bcrypt.hashSync(req.body.passcode, bcrypt.genSaltSync(8), null);
        newUser.save()
          .then((newUserObj) => {
            console.log("New user created. _id: " + newUserObj._id);
            res.status(200).send(newUserObj);

          })
          .catch((err) => {
            console.log(err);
            res.status(500).send({
              "message": "Sorry! something went wrong. Please try again"
            });
          });
      }
    });
};

//forgot user details - by ID
exports.forgotPasscode = function (req, res, next) {
  console.log(req.body);
  User.findOne({
    "email": req.body.email
  })
    .then((singleUser) => {
      if (singleUser) {
        var token = crypto.randomBytes(8).toString('hex');
        User.findByIdAndUpdate({ _id: singleUser._id }, { resetPasswordToken: token, resetPasswordExpires: Date.now() + 86400000 }, { upsert: true, new: true })
          .then((singleUser) => {
            if (singleUser) {
              console.log("Updated User with _id: " + singleUser._id);
              var data = {
                to: singleUser.email,
                from: "<provide the email id>",
                template: 'forgot password email',
                subject: 'Password help has arrived!',
                text: 'Forgot Password', // plaintext body 
                html: 'Here is the token for reset password : ' + token // html body 
              }

              mail(data, function (response) {
                res.status(200).send({
                  "message": "A link has sent to your mail account !!!",
                  "token": token
                });
              });
            }
            else {
              console.log("Could not find user with that email ID.");
              res.status(404).send({
                "message": "Sorry! login failed. Could not find user with that email ID."
              });
            }

          })
          .catch((err) => {
            console.log("Error finding a user with that Email ID. " + req.body.email);
            res.status(404).send(err);
          });


      }
    })
}


//reset user details - by ID
exports.resetPasscode = function (req, res, next) {
  User.findOne({
    resetPasswordToken: req.body.token,
    resetPasswordExpires: {
      $gt: Date.now()
    }
  })
    .then((singleUser) => {
      if (singleUser) {
        if (req.body.newpasscode == req.body.repasscode) {
          singleUser.resetPasswordToken = undefined;
          singleUser.resetPasswordExpires = undefined;
          singleUser.passcode = bcrypt.hashSync(req.body.newpasscode, bcrypt.genSaltSync(8), null);
          singleUser.save()
            .then((newUserObj) => {
              console.log("New user created. _id: " + newUserObj._id);
              //res.status(200).send(newUserObj);

              var data = {
                to: singleUser.email,
                from: "iotnode123@gmail.com",
                template: 'reset password email',
                subject: 'Password reset has done!',
                text: 'Password has changed successfully !!!', // plaintext body 
              }
              mail(data, function (response) {
                res.status(200).send({
                  "message": "Password has changed successfully !!!"
                });
              });
            })
            .catch((err) => {
              console.log(err);
              res.status(500).send({
                "message": "Sorry! something went wrong. Please try again"
              });
            });
        } else {
          console.log('Passwords do not match');
          res.status(400).send({
            message: 'Passwords do not match'
          });
        }

      }
      else {
        res.status(400).send({
          message: 'Password reset token is invalid or has expired.'
        });
      }
    })
}




//login details - by ID
exports.login = function (req, res, next) {
  User.findOne({
    "email": req.body.email
  })
    .then((singleUser) => {
      if (singleUser) {
        if (bcrypt.compareSync(req.body.passcode, singleUser.passcode) == true) {
          console.log('login success !!!');
          res.status(200).send({
            "message": "Login success !!!"
          });

        } else {
          console.log('login failed!!! Please check the Password');
          res.status(404).send({
            "message": "Sorry! login failed. Please check your password"
          });
        }

      } else {
        console.log("Could not find user with that email ID.");
        res.status(404).send({
          "message": "Sorry! login failed. Could not find user with that email ID."
        });
      }
    })
    .catch((err) => {
      console.log(err);
      res.status(500).send({
        "message": "Sorry! something went wrong. Please try again"
      });
    });
};
