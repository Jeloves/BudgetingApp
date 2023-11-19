import express from 'express';
import { connection } from '../server.js';
import { validateSessionID } from '../models/login.js';
import { getLastUsedBudget } from '../models/budget.js';

export const budgetRouter = express.Router();

budgetRouter.get('/', (request, result) => {
    validateSessionID(connection, request.session.id).then(
        function resolved(userID) {
            getLastUsedBudget(connection, userID);
        },
        function rejected() {
            result.redirect('./login')
            console.error('Well, shit!')
        }
    );


});

budgetRouter.post('/', (request, result) => {

});


