import { } from '../errors.js';

class Budget {
    #name;
    #date;
    #accounts = [];
    #categories = [];
    constructor(name, date, accounts, categories) {
        this.#name = name;
        this.#date = date;
    }
    initializeData(accounts, categories) {
        this.#accounts = accounts;
        this.#categories = categories;
    }
}

class Account {
    #name;
    #balance;
    constructor(name, balance) {
        this.#name = name;
        this.#balance = balance;
    }
}

class Category {
    #name;
    #subcategories = [];
    constructor(name) {
        this.#name = name;
    }
    addSubcategory(subcategory) {
        this.#subcategories.push(subcategory);
        // TODO SORT
    }
}

class Subcategory {
    #name;
    #allocations = [];
    constructor(name) {
        this.#name = name;
    }
    addAllocation(allocation) {
        this.#allocations.push(allocation);
        // TODO SORT
    }
}

class Allocation {
    #date;
    #amount;
    constructor(date, amount) {
        this.#date = date;
        this.#amount = amount;
    }
}

export async function getBudgetData(connection, userID) {
    try {
        // Retrieving last used budget ID
        const budgetID = await getLastUsedBudgetID(connection, userID);
        const budgetObject = await getLastUsedBudget(connection, budgetID);
        // Retrieving accounts
        const accountIDs = await getAccountIDs(connection, budgetID);
        const accountObjects = [];
        for (let accountID of accountIDs) {
            accountObjects.push(await getAccount(connection, accountID));
        }
        // Retrieving categories & subcategories & allocations
        const categoryIDs = await getCategoryIDs(connection, budgetID);
        const categoryObjects = [];
        for (let categoryID of categoryIDs) {
            const categoryObject = await getCategory(connection, categoryID);
            // Getting subcategories for this category
            const subcategoryIDs = await getSubcategoryIDs(connection, categoryID);
            for (let subcategoryID of subcategoryIDs) {
                const subcategoryObject = await getSubcategory(connection, subcategoryID);
                // Getting allocations for this subcategory
                const allocationIDs = await getAllocationIDs(connection, subcategoryID);
                for (let allocationID of allocationIDs) {
                    subcategoryObject.addAllocation(await getAllocation(connection, allocationID));
                }
                categoryObject.addSubcategory(subcategoryObject);
            }
            categoryObjects.push(categoryObject);
        }
        // Creating the budget view model
        budgetObject.initializeData(accountObjects, categoryObjects);
        return new Promise((resolve) => {
            resolve(budgetObject);
        })
    
    } catch(error) {
        console.error('An error has occured some-fucking-where.');
        return new Promise((resolve, reject) => {
            reject();
        })
    }
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
function getLastUsedBudget(connection, budgetID) {
    return new Promise((resolve, reject) => {
        const sql = `SELECT * FROM budget WHERE id = '${budgetID}'`;
        return connection.query(sql, (error, result) => {
            if (error) {
                console.error(`Failed to retrieve budget data: ${error}`);
                return reject(error);
            } else {
                console.log(`Budget data retrieved.`);
                return resolve(new Budget(result[0].name, result[0].date));
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
function getAccount(connection, accountID) {
    return new Promise((resolve, reject) => {
        const sql = `SELECT * FROM account WHERE id = '${accountID}'`;
        return connection.query(sql, (error, result) => {
            if (error) {
                console.error(`Failed to retrieve account data: ${error}`);
                return reject();
            } else {
                console.log(`Account data retrieved.`);
                resolve(new Account(result[0].name,result[0].balance));
            }
        });
    });
}

function getCategoryIDs(connection, budgetID) {
    return new Promise((resolve, reject) => {
        const sql = `SELECT * FROM category_budget WHERE budgetID = '${budgetID}'`;
        return connection.query(sql, (error, result) => {
            if (error) {
                console.error(`Failed to retrieve category ids: ${error}`);
                return reject()
            } else {
                const categoryIDs = [];
                for (let i in result) {
                    categoryIDs.push(result[i].categoryID);
                }
                console.log(`Category ids retrieved.`);
                return resolve(categoryIDs);
            }
        });
    });
}
function getCategory(connection, categoryID) {
    return new Promise((resolve, reject) => {
        const sql = `SELECT * FROM category WHERE id = '${categoryID}'`;
        return connection.query(sql, (error, result) => {
            if (error) {
                console.error(`Failed to retrieve category data: ${error}`);
                return reject();
            } else {
                console.log(`Category data retrieved.`);
                return resolve(new Category(result[0].name));
            }
        });
    });
}

function getSubcategoryIDs(connection, categoryID) {
    return new Promise((resolve, reject) => {
        const sql = `SELECT * FROM subcategory_category WHERE categoryID = '${categoryID}'`;
        return connection.query(sql, (error, result) => {
            if (error) {
                console.error(`Failed to retrieve subcategory ids: ${error}`);
                return reject();
            } else {
                const subcategoryIDs = [];
                for (let i in result) {
                    subcategoryIDs.push(result[i].subcategoryID);
                }
                console.log(`Subcategory ids retrieved.`);
                return resolve(subcategoryIDs);
            }
        });
    });
}
function getSubcategory(connection, subcategoryID) {
    return new Promise((resolve, reject) => {
        const sql = `SELECT * FROM subcategory WHERE id = '${subcategoryID}'`;
        return connection.query(sql, (error, result) => {
            if (error) {
                console.error(`Failed to retrieve subcategory data: ${error}`);
                return reject();
            } else {
                console.log(`Subcategory data retrieved.`);
                return resolve(new Subcategory(result[0].name));
            }
        });
    });
}

function getAllocationIDs(connection, subcategoryID) {
    return new Promise((resolve, reject) => {
        const sql = `SELECT * FROM allocation_subcategory WHERE subcategoryID = '${subcategoryID}'`;
        return connection.query(sql, (error, result) => {
            if (error) {
                console.error(`Failed to retrieve allocation ids: ${error}`);
                return reject();
            } else {
                const allocationIDs = [];
                for (let i in result) {
                    allocationIDs.push(result[i].allocationID);
                }
                console.log(`Allocation ids retrieved.`);
                return resolve(allocationIDs);
            }
        });
    });
}
function getAllocation(connection, allocationID) {
    return new Promise((resolve, reject) => {
        const sql = `SELECT * FROM allocation WHERE id = '${allocationID}'`;
        return connection.query(sql, (error, result) => {
            if (error) {
                console.error(`Failed to retrieve allocation data: ${error}`);
                return reject();
            } else {
                console.log(`Allocation data retrieved.`);
                return resolve(new Allocation(result[0].date, result[0].amount));
            }
        });
    });
}
