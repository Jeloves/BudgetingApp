import express from 'express';
import { validateUserCredentials, loginUser } from '../models/login.js'
import { connection } from '../server.js';

export const loginRouter = express.Router();

loginRouter.get('/', (request, result) => {
    console.log('Login view rendered');
    result.render('login');
});

loginRouter.use(express.urlencoded({ extended: true }))
loginRouter.post('/', (request, result) => {
    console.log(`Validating credentials...`)
    validateUserCredentials(connection, request.body.username, request.body.password).then(
        function resolved(userID) {
            loginUser(connection, request.session.id, userID).then(
                function resolved() {
                    result.redirect('./budget');
                },
                function rejected() {
                    result.render('login');
                })
        },
        function rejected() {
            result.render('login');
        });
});


