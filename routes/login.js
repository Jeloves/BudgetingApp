import express from 'express';
import path from 'path';
import { loginUser } from '../models/user.js'
import { fileURLToPath } from 'url';

export const loginRouter = express.Router();

const __subdirname = path.dirname(fileURLToPath(import.meta.url));
const __dirname = path.dirname(__subdirname);

loginRouter.get('/', (request, result) => {
    result.sendFile('/login_script.js');
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