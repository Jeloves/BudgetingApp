import express from 'express';
import { connection } from '../server.js';
import { validateSessionID } from '../models/login.js';
import { getBudgetData } from '../models/budget.js';

export const budgetRouter = express.Router();

budgetRouter.get('/', (request, result) => {
    validateSessionID(connection, request.session.id).then(
        (userID) => {handleResolvedSessionID(result, userID)},
        handleRejectedSessionID()
    );
});

budgetRouter.post('/', (request, result) => {

});

function handleResolvedSessionID(result, userID) {
    getBudgetData(connection, userID).then((budgetObject) => {
        result.sendFile()
        result.render('budget')
    });
}
function handleRejectedSessionID() {
    console.error('Oh god what do we do....')
}
