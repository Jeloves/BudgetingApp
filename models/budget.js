import { v4 as uuidv4 } from 'uuid';
import { connection } from '../server.js';
import { sessionValidationError, lastUsedBudgetError } from '../errors.js';

export class Budget {
    #name;
    #date;
    constructor(id, name, date) {
        this.#name = name;
        this.#date = date;
    }
    getName() {
        return this.#name;
    }
    getDateCreated() {
        return this.#date;
    }
}


async function getUserID(sessionID) {
    return new Promise((resolve, reject) => {
        const sql = `SELECT * FROM session_user WHERE sessionID = '${sessionID}'`;
        return connection.query(sql, (error, result) => {
            // Error cases for validating user session with database information.
            if (error) {
                return reject(error);
            } else if (result.length === 1) {
                return resolve(result[0].id);x
            } else {
                return reject(sessionValidationError);
            }
        });
    });
}

// Returns the budgetID of user's last used budget.
// Will return the budgetID of a newly created budget if user has no budgets yet.
export async function getLastUsedBudgetID(sessionID) {
    return getUserID(sessionID).then(
        (userID) => {
            return new Promise((resolve, reject) => {
                const sql = `SELECT * FROM user_budget WHERE userID = '${userID}' AND lastUsed = '${1}'`;
                return connection.query(sql, (error, result) => {
                    if (error) {
                        return reject(error);
                    } else if (result.length === 1) {
                        return resolve(result[0].budgetID);
                    } else if (result.length === 0) {
                        createBudget(userID, 'New Budget').then(
                            (budgetID) => {
                                return resolve(budgetID);
                            },
                            (error) => {
                                return reject(error);
                            });
                    } else {
                        return reject(lastUsedBudgetError);
                    }
                });
            });
        },
        (error) => {
            return new Promise((resolve, reject) => {
                return reject(error)
            })
        });
}



function createBudget(userID, name) {
    return new Promise((resolve, reject) => {
        const budgetID = uuidv4();
        const budgetDate = new Date().toISOString().slice(0, 19).replace('T', ' ');
        const sql = `INSERT INTO budget (id, name, date) VALUES ('${budgetID}', '${name}', '${budgetDate}')`;
        return connection.query(sql, (error) => {
            if (error) {
                console.error(`Failed to create budget: ${error}`);
                return reject(error);
            } else {
                console.log('New budget created.');
                return createUserBudgetLink(userID, budgetID).then(
                    function onSuccess() {
                        return resolve(budgetID);
                    },
                    function onFailure(error) {
                        return reject(error);
                    }   
                );
            }
        });
    });
}
function createUserBudgetLink(userID, budgetID) {
    return new Promise((resolve, reject) => {
        const sql = `INSERT INTO user_budget (userID, budgetID, lastUsed) VALUES ('${userID}','${budgetID}',1)`;
        return connection.query(sql, (error) => {
            if (error) {
                console.error(`Failed to create user_budget: ${error}`);
                return reject(error);
            } else {
                console.log('New user_budget created.');
                return resolve()
            }
        })
    })
}