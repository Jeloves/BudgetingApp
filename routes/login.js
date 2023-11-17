import express from 'express';
import { validateUserCredentials } from '../models/user.js'
import cookieParser from 'cookie-parser';
import { SessionTimer } from '../models/session.js';

export const loginRouter = express.Router();

loginRouter.use(cookieParser());
loginRouter.get('/', (request, result) => {
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
            console.log('User log in successful.');
            setSessionCookie(result, sessionID, 5);
            result.redirect('./budget');
        },
        function rejected() {
            console.error('User log in failed.')
            result.render('login');
        });
});

function setSessionCookie(result, sessionID, minutesToElapse) {
    const currentDate = new Date();
    const expiration = new Date(currentDate.getTime() + minutesToElapse * 60000);
    result.cookie(`sessionID`, sessionID, {
        expires: expiration,
        secure: false,
        httpOnly: true,
        sameSite: 'lax'
    });
}

