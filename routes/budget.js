import express from 'express';
import { pool } from '../server.js';
import { getUserData } from '../models/budget.js';

export const budgetRouter = express.Router();

class Dog {
    constructor(name) {
        this.name = name;
    }
}
budgetRouter.use(express.urlencoded({ extended: true }));
budgetRouter.get('/', (request, result) => {
    getUserData(pool, 'faf4a612-5c38-4e12-97fa-fa31a888fcfb').then(
        (user) => {
            result.render('budget', {user: new Dog('Rex')});
        },
        (error) => {
            console.error(error)
        }
    );
});




