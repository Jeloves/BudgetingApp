import express from 'express';
import { connection } from '../server.js';
import { validateSessionID } from '../models/login.js';
import { getBudgetData } from '../models/budget.js';

export const budgetRouter = express.Router();

budgetRouter.get('/', (request, result) => {
    validateSessionID(connection, request.session.id).then(
        (userID) => {
            const year = new Date().getFullYear();
            const month = new Date().getMonth() + 1;
            getBudgetData(connection, userID, year, month).then((budgetObject) => {
                result.render('budget', { budget: budgetObject})
            });
        },
        () => { handleRejectedSessionID() }
    );
});


function handleRejectedSessionID() {
    console.error('Oh god what do we do....')
}


