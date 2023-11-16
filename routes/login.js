import express from 'express';
import { loginUser } from '../models/user.js'
export const loginRouter = express.Router();

loginRouter.get('/', (request, result) => {
    result.render('login');
    console.log('Login view rendered.');
});

loginRouter.use(express.urlencoded({extended: true}))
loginRouter.post('/', (request, result) => {
    let username = request.body.username;
    let password = request.body.password;
    console.log('Attempting login...');
    loginUser(username,password).then(()=>{
        console.log('User logged in successfully.')
        result.redirect('./');
    });
}); 