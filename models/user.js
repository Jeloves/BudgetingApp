import * as mysql from 'mysql2';
import { v4 as uuidv4 } from 'uuid';
import { Budget } from './budget.js';

class User {
    #id;
    #name;
    #password;
    #email;
    #date;
    constructor(id, name, password, email, date) {
        this.#id = id;
        this.#name = name;
        this.#password = password;
        this.#email = email;
        this.#date = date;
    }
    getUserID() {
        return this.#id;
    }
    getName() {
        return this.#name;
    }
    getPassword() {
        return this.#password;
    }
    getEmail() {
        return this.#email;
    }
    getDate() {
        return this.#date;
    }
}

const connection = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "gengiW-temmy2-wahnap",
    database: "user_data"
});

let currentUser = null;
let currentBudget = null;
export function getCurrentUser() {
    return currentUser;
}

export async function loginUser(username, password) {
    const validation = validateCredentials(username, password);
    validation.then((user) => {
        switch (user) {
            case true:
                console.error('ERROR: Multiple users with these credentials were found in database.');
            case false:
                console.error('ERROR: Failed to connect to database.');
            case null:
                console.error('ERROR: Credentials were valid, but no user found.');
            default:
                console.log('User signed in.')
                currentUser = new User('userID_' + uuidv4(), user.username, 'userPassword_' + uuidv4(), user.email, user.date);
                const currentBudgetID = getLastUsedBudgetID(user.id)
                currentBudgetID.then((budgetID) => {
                    currentBudget = getBudgetByID(budgetID);
                    console.log(`Current Budget: ${currentBudget}`);
                })
        }
    }, () => { console.log('Promise rejected logging into user.') });
}

function validateCredentials(username, password) {
    return new Promise((resolve, reject) => {
        const sql = `SELECT * FROM user WHERE username = '${username}' AND password = '${password}'`;
        return connection.query(sql, (error, result) => {
            if (error) {
                return reject(false);
            } else if (result.length === 1) {
                return resolve(result[0]);
            } else {
                return reject(true);
            }
        });
    });

}

function getLastUsedBudgetID(userID) {
    return new Promise((resolve, reject) => {
        const sql = `SELECT * FROM user_budget WHERE userID = '${userID}' AND budgetLastUsed = '1'`
        return connection.query(sql, (error, result) => {
            if (error) {
                return reject(error);
            } else if (result.length > 1) {
                return reject('ERROR: Multiple last used budgets found.')
            } else if (result.length === 0) {
                const newBudgetPromise = createNewBudget(userID);
                newBudgetPromise.then((budget) => {
                    const updateTablePromise = updateUserBudgetTable(userID,budget.id);
                    updateTablePromise.then(() => {
                        return resolve(budget.id);
                    })
                });
            } else if (result.length === 1) {
                return resolve(result[0].budgetID);
            } else {
                return reject('ERROR: Unknown error @ getLastUsedBudget()');
            }
        })
    })
}
function getBudgetByID(budgetID) {
    return new Promise((resolve, reject) => {
        const sql = `SELECT * FROM budget WHERE id = '${budgetID}'`
        return connection.query(sql, (error, result) => {
            if (error) {
                return reject(error);
            } else if (result.length > 1) {
                return reject('ERROR: Multiple last used budgets found.')
            } else if (result.length === 0) {
                return reject('ERROR: No budgets found even after calling createNewBudget().')
            } else if (result.length === 1) {
                return resolve(result[0]);
            } else {
                return reject('ERROR: Unknown error @ getBudgetByID()');
            }
        })
    })
}

function createNewBudget() {
    return new Promise((resolve, reject) => {
        const budgetID = uuidv4()
        const sql = `INSERT INTO budget (id,name,date) VALUES ('${budgetID}','My New Budget','${new Date()}')`;
        return connection.query(sql, (error, result) => {
            if (error) {
                return reject(error);
            } else {
                currentBudget = new Budget(`budgetID_${uuidv4()}`,result.name,result.date);
                return resolve(result);
            }
        });
    });
}
function updateUserBudgetTable(userID,budgetID) {
    return new Promise((resolve, reject) => {
        const sql = `INSERT INTO user_budget (userID,budgetID,budgetLastUsed) VALUES ('${userID}','${budgetID}','1')`;
        return connection.query(sql, (error, result) => {
            if (error) {
                return reject(error);
            } else {
                return resolve();
            }
        });
    });
}

/*
function checkLastUsedBudget(userID) {
    return new Promise((resolve,reject) => {
        const sql = `SELECT * FROM user_budget WHERE userID = '${userID}' AND budgetLastUsed = '${true}'`;
        return connection.query(sql, (error,result) => {
            if (error) {
                return reject(false);
            } else if (result.length > 0) {
                return reject(true);
            } else if (result.length === 1) {
                return resolve(result[0]);
            } else if (result.length === 0) {
                console.log('A new budget must be created...')
                const budgetPromise = createNewBudget(userID,'New Budget',new Date());
                budgetPromise.then((newBudget) => {
                    resolve(newBudget[0])
                })
            }
            else {
                return reject(null);
            }
        })
    })
}


function createNewBudget(userID,name,date) {
    console.log('Creating new budget...')
    const budgetID = uuidv4()
    const budgetPromise = new Promise((resolve,reject) => {
        const sql = `INSERT INTO budget(id,name,date) VALUES ('${userID}','${name}','${date}')`;
        return connection.query(sql, (error,result) => {
            if (error) {
                return reject(false);
            } else {
                console.log(`Result of createNewBudget Promise: ${result}`)
                return resolve(result[0]);
            }
        })
    });
    budgetPromise.then(()=>{
        const sql = `INSERT INTO user_budget(userID,budgetID,budgetLastUsed) VALUES ('${userID}','${budgetID}',1)`;
        connection.query(sql, (error,result) => {
            if (error) {
                console.log(error)
            } else {
                console.log('Budget successfully created.');
            }
        })
        return budgetPromise;
    });
}
*/