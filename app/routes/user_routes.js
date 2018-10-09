const userController = require("../controllers/userController.js");

module.exports = function (app, router) {
    app.route('/login')
        .post(userController.login);


    app.route('/register')
        .post(userController.create);

    app.route('/forgot_password')
        .post(userController.forgotPasscode);


    app.route('/reset_password')
        .post(userController.resetPasscode)
}
