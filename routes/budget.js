import express from 'express';

export const budgetRouter = express.Router();

budgetRouter.get('/', (request, result) => {
    console.log('Accomplished!')
    result.render('budget')
});




