import { } from '../errors.js';


let currentBudgetName = null;
let currentBudgetDate = null;

export function getBudgetData(connection, userID) {
    getBudgetID(connection, userID).then(
        function resolved(budgetID) {
            getBudgetNameDate(connection, budgetID).then(
                function resolved(budget) {
                    currentBudgetName = budget.name;
                    currentBudgetDate = budget.date;
                },
                function rejected(error) {
                    console.error(`Failed to retrieve budget data: ${error}`);
                }
            )
        },
        function rejected(error) {
            console.error(`Failed to retrieve budget id: ${error}`);
        }
    );
}

function getBudgetID(connection, userID) {
    return new Promise((resolve, reject) => {
        const sql = `SELECT * FROM budget_user WHERE userID = '${userID}'`;
        return connection.query(sql, (error, result) => {
            if (error) {
                return reject(error);
            } else {
                return resolve(result[0].budgetID);
            }
        });
    });
}
function getBudgetNameDate(connection, budgetID) {
    return new Promise((resolve, reject) => {
        const sql = `SELECT * FROM budget WHERE id = '${budgetID}'`;
        return connection.query(sql, (error, result) => {
            if (error) {
                console.error(`Failed to retrieve budget data: ${error}`);
                return reject(error);
            } else {
                console.log(`Budget data retrieved successfully.`);
                return resolve(result[0]);
            }
        });
    });
}

