import express from 'express';
import path from 'path';
import { validateUserCredentials } from '../models/user.js'
import { fileURLToPath } from 'url';
import cookieParser from 'cookie-parser';
import {getLastUsedBudgetID} from '../models/budget.js'; 

export const loginRouter = express.Router();

const __subdirname = path.dirname(fileURLToPath(import.meta.url));
const __dirname = path.dirname(__subdirname);

loginRouter.use(cookieParser());
loginRouter.get('/', (request, result) => {
    result.sendFile('/login_script.js');
    result.render('login');
    console.log('Login view rendered.');
});

loginRouter.use(express.urlencoded({ extended: true }))
loginRouter.post('/', (request, result) => {
    let username = request.body.username;
    let password = request.body.password;
    console.log('Attempting login...');
    const validationPromise = validateUserCredentials(username, password);
    validationPromise.then(
        function resolved(sessionID) {
            console.log('User log in successful.')
            setUserSessionCookie(result, sessionID, 1);
            getLastUsedBudgetID()
            
            console.log(`This is the endpoint: `)
            result.redirect('./');
        },
        function rejected() {
            console.error('User log in failed.')
            result.render('login');
        });
});

function setUserSessionCookie(result, sessionID, minutesToElapse) {
    const currentDate = new Date();
    const expiration = new Date(currentDate.getTime() + minutesToElapse * 60000);
    result.cookie(`sessionID`, sessionID, {
        expires: expiration,
        secure: false,
        httpOnly: true,
        sameSite: 'lax'
    });
}