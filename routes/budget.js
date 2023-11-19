import express from 'express';
import cookieParser from 'cookie-parser';

export const budgetRouter = express.Router();

budgetRouter.use(cookieParser());
budgetRouter.get('/', (request, result) => {
    const sessionID = request.session.id
    result.render('budget');
});

budgetRouter.post('/', (request, result) => {

})


