import express from 'express';
import { connection } from '../server.js';
import { validateSessionID } from '../models/login.js';

export const budgetRouter = express.Router();

budgetRouter.get('/', (request, result) => {
    validateSessionID(connection, request.session.id).then(
        function resolved(userID) {
            result.render('budget')
            console.log(`USRID: ${userID}`);
        },
        function rejected() {
            console.error('Well, shit!')
        }
    );


});

budgetRouter.post('/', (request, result) => {
    getBudgetData(request.session.id).then(
        function resolved(budgetData) {
            console.log('Budget data retrieved.')
            result.render('budget');
        },
        function rejected() {
            console.log('Unable to retrieve budget data.')
            result.render('budget');
        }
    );
});


