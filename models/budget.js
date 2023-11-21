import { } from '../errors.js';

class Budget {
    #name;
    #date;
    #accounts = [];
    #categories = [];
    constructor(name, date) {
        this.#name = name;
        this.#date = date;
    }
    initializeData(accounts, categories, year, month) {
        this.#accounts = accounts;
        this.#categories = categories;
        // Setting allocation to display based on year and month.
        for (let category of this.#categories) {
            for (let subcategory of category.getSubcategories()) {
                for (let allocation of subcategory.getAllocations()) {
                    if (allocation.getYear() === year || allocation.getMonth() === month) {
                        subcategory.setAvailableBalance(allocation.getAmount());
                        break;
                    }
                }
            }
        }
    }
    getName() {
        return this.#name;
    }
    getDate() {
        return this.#date;
    }
    getAccounts() {
        return this.#accounts;
    }
    getCategories() {
        return this.#categories;
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
    getName() {
        return this.#name;
    }
    getSubcategories() {
        return this.#subcategories;
    }
}

class Subcategory {
    #name;
    #allocations = [];
    #availableBalance = 0.00;
    constructor(name) {
        this.#name = name;
    }
    addAllocation(allocation) {
        this.#allocations.push(allocation);
        // TODO SORT
    }
    getName() {
        return this.#name; 
    }
    getAllocations() {
        return this.#allocations;
    }
    setAvailableBalance(balance) {
        this.#availableBalance = balance;
    }
    getAvailableBalance() {
        return this.#availableBalance;
    }
}

class Allocation {
    #year;
    #month;
    #amount;
    constructor(year, month, amount) {
        this.#year = year;
        this.#month = month;
        this.#amount = amount;
    }
    getYear() {
        return this.#year;
    }
    getMonth() {
        return this.#month;
    }
    getAmount() {
        return this.#amount;
    }
}

export async function getBudgetData(connection, userID, year, month) {
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
        budgetObject.initializeData(accountObjects, categoryObjects, year, month);
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
                return resolve(new Allocation(result[0].year, result[0].month, result[0].amount));
            }
        });
    });
}