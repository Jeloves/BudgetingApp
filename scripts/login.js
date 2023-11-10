import {LoginController} from '../controllers/login_controller.js'

const loginController = new LoginController();

document.getElementById('form_user_login').addEventListener('submit', () => {
    let username = document.querySelector('#input_user_name').value;
    let password = document.querySelector('#input_user_password').value;
    if (username.value == "" || password.value == "") {
        console.log('Both a userename and password must be entered.');
    } else {
        loginController.signInUser(username,password);
    }
})
