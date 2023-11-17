import express from 'express';
import cookieParser from 'cookie-parser';
import { getLastUsedBudgetID } from '../models/budget.js';

export const budgetRouter = express.Router();

budgetRouter.use(cookieParser());
budgetRouter.get('/', (request, result) => {
    getLastUsedBudgetID(request.cookies.sessionID).then(
        function resolved(budgetID) {
            console.log(`BudgetID acquired: ${budgetID}`);
            result.render('budget');
        },
        function rejected(error) {
            console.error(`Last used budget could not be retrieved: ${error}`);
        }
    );
});


