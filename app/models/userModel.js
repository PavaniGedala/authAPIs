//Requiring Mongoose
var mongoose = require('mongoose');

//Defining Schema
var userSchema = mongoose.Schema({

    name: {
        type: String,
        required: true
    },

    email: {
        type: String,
        required: true
    },

    passcode: {
        type: String,
        required: true
    },

    token: {
        type: String
    },

    resetPasswordToken: {
        type: String
    },

    resetPasswordExpires: {
        type: String
    },

    create_date: {
        type: Date,
        default: Date.now
    }
});

//Exporting the file
var User = module.exports = mongoose.model('user_colls', userSchema); //Binding schema to UserCollection

