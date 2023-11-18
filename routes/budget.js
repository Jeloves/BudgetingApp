import express from 'express';
import cookieParser from 'cookie-parser';
import { getLastUsedBudgetID } from '../models/budget.js';
import session from 'express-session';

export const budgetRouter = express.Router();

budgetRouter.use(cookieParser());
budgetRouter.get('/', (request, result) => {
    result.render('budget');
    console.log(request.session.userID);
    /*
    getLastUsedBudgetID(request.cookies.sessionID).then(
        function resolved(budgetID) {
            console.log(`BudgetID acquired: ${budgetID}`);
            result.render('budget');
        },
        function rejected(error) {
            console.error(`Last used budget could not be retrieved: ${error}`);
        }
    );
    */
});


