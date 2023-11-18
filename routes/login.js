import express from 'express';
import { validateUserCredentials } from '../models/login.js'
import cookieParser from 'cookie-parser';



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
    validateUserCredentials(username, password).then(
        function resolved(userID) {
            console.log('User validation successful.');
            startSession(userID);
            result.redirect('./budget');
        },
        function rejected(error) {
            console.error(`User validation failed: ${error}`)
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

