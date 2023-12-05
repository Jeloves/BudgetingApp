import express from 'express';
import { pool } from '../server.js';
import { getUserData } from '../models/budget.js';

export const budgetRouter = express.Router();

budgetRouter.get('/', (request, result) => {
    getUserData(pool, request.session.passport.user.id).then(
        (user) => {
            console.log(user)
            result.render('budget', {user: user});
        },
        (error) => {
            console.error(error)
        }
    );
});




