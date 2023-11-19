import { } from '../errors.js';


let currentBudgetName = null;
let currentBudgetDate = null;

export function getLastUsedBudget(connection, userID) {
    getLastUsedBudgetID(connection, userID).then(
        (budgetID) => {
            getBudgetData(connection, budgetID).then(
                (budget) => {
                    currentBudgetName = budget.name;
                    currentBudgetDate = budget.date;
                    getAccountIDs(connection, budgetID).then(
                        (accountIDs) => {
                            for (let id of accountIDs) {
                                getAccountData(connection, id).then((account) => {
                                    console.log(`Account Name: ${account.name}`)
                                });
                            }
                        }
                    )
                }
            )
        }
    );
}

function getLastUsedBudgetID(connection, userID) {
    return new Promise((resolve, reject) => {
        const sql = `SELECT * FROM budget_user WHERE userID = '${userID}' AND lastUsed = '1'`;
        return connection.query(sql, (error, result) => {
            if (error) {
                console.error(`Failed to retrieve last used budget id: ${error}`);
                return reject(error);
            } else {
                console.log(`Retrieved last used budget id.`);
                return resolve(result[0].budgetID);
            }
        });
    });
}
function getBudgetData(connection, budgetID) {
    return new Promise((resolve, reject) => {
        const sql = `SELECT * FROM budget WHERE id = '${budgetID}'`;
        return connection.query(sql, (error, result) => {
            if (error) {
                console.error(`Failed to retrieve budget data: ${error}`);
                return reject(error);
            } else {
                console.log(`Budget data retrieved.`);
                return resolve(result[0]);
            }
        });
    });
}

function getAccountIDs(connection, budgetID) {
    return new Promise((resolve, reject) => {
        const sql = `SELECT * FROM account_budget WHERE budgetID = '${budgetID}'`;
        return connection.query(sql, (error, result) => {
            if (error) {
                console.error(`Failed to retrieve account ids: ${error}`);
                return reject()
            } else {
                const accountIDs = [];
                for (let i in result) {
                    accountIDs.push(result[i].accountID);
                }
                console.log(`Account ids retrieved.`);
                return resolve(accountIDs);
            }
        });
    });
}
function getAccountData(connection, accountID) {
    console.log(`Account ID; ${accountID}`)
    return new Promise((resolve, reject) => {
        const sql = `SELECT * FROM account WHERE id = '${accountID}'`;
        return connection.query(sql, (error, result) => {
            if (error) {
                console.error(`Failed to retrieve account data: ${error}`);
                return reject();
            } else {
                console.log(`Account data retrieved.`);
                return resolve(result[0]);
            }
        });
    });
}
