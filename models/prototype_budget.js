import mysql from 'mysql2'
import { v4 as uuidv4 } from 'uuid';
import { NIL as NIL_UUID } from 'uuid';

const connectionHost = 'localhost';
const connectionUser = 'root';
const connectionPassword = 'gengiW-temmy2-wahnap';
const connectionDatabase = 'new_leaf_data';
const myconnection = mysql.createConnection({
    host: connectionHost,
    user: connectionUser,
    password: connectionPassword,
    database: connectionDatabase,
    namedPlaceholders: true
});

class Budget {
    #id;
    #name;
    #date;
    #locale;
    #currency;
    #selected;
    constructor(id, name, date, locale, currency, selected) {
        this.#id = id;
        this.#name = name;
        this.#date = date;
        this.#locale = locale;
        this.#currency = currency;
        this.#selected = selected;
    }
}
class Account {
    #name;
    #balance;
    constructor(name, balance) {
        this.#name = name;
        this.#balance = parseFloat(balance);
    }
    getName() {
        return this.#name;
    }
    getBalance() {
        return this.#balance;
    }
}
class Category {
    #id;
    #position;
    #name;
    #subcategories = [];
    constructor(id, position, name) {
        this.#id = id;
        this.#position = position;
        this.#name = name;
    }
    getPosition() {
        return this.#position;
    }
}
class Subcategory {
    #id;
    #position;
    #name;
    constructor(id, position, name) {
        this.#id = id;
        this.#position = position;
        this.#name = name;
    }
    getPosition() {
        return this.#position;
    }
}
class Allocation {
    #id;
    #year;
    #month;
    #balance;
    constructor(id, year, month, balance) {
        this.#id = id;
        this.#year = year;
        this.#month = month;
        this.#balance = balance;
    }
}
class Transaction {
    #id;
    #date;
    #payee;
    #memo;
    #balance;
    #approval;
    #accountID;
    #categoryID;
    #subcategoryID;
    constructor(id, date, payee, memo, balance, approval, accountID, categoryID, subcategoryID) {
        this.#id = id;
        this.#date = date;
        this.#payee = payee;
        this.#memo = memo;
        this.#balance = parseFloat(balance);
        this.#approval = approval;
        this.#accountID = accountID;
        this.#categoryID = categoryID;
        this.#subcategoryID = subcategoryID;
    }
}

// Budget
export function createBudget(connection, name, date, locale, currency, userID) {
    return new Promise((resolve, reject) => {
        const budgetID = uuidv4()
        const sql = 'INSERT INTO budget (id,name,date,locale,currency,selected,user_id) VALUES (?,?,?,?,?,?,?)';
        return connection.query(sql, [budgetID, name, date, locale, currency, 0, userID], (error) => {
            if (error) {
                return reject(error);
            } else {
                return resolve(new Budget(name, date, locale, currency, false));
            }
        });
    });
}
export function readBudgets(connection, userID) {
    return new Promise((resolve, reject) => {
        const sql = 'SELECT * FROM budget WHERE user_id = ?';
        return connection.query(sql, [userID], (error, result) => {
            if (error) {
                return reject(error);
            } else {
                const budgets = [];
                for (let row of result) {
                    budgets.push(new Budget(row.id, row.name, row.date, row.locale, row.currency, row.selected));
                }
                return resolve(budgets);
            }
        });
    });
}
export function updateBudgetName(connection, newName, budgetID) {
    return new Promise((resolve, reject) => {
        const sql = 'UPDATE budget SET name = ? WHERE id = ?';
        connection.query(sql, [newName, budgetID], (error) => {
            if (error) {
                return reject(error);
            } else {
                return resolve()
            }
        });
    });
}
export function updateBudgetCurrency(connection, newLocale, newCurrency, budgetID) {
    return new Promise((resolve, reject) => {
        const sql = 'UPDATE budget SET locale = ?, currency = ? WHERE id = ?';
        connection.query(sql, [newLocale, newCurrency, budgetID], (error) => {
            if (error) {
                return reject(error);
            } else {
                return resolve();
            }
        });
    });
}
export function updateBudgetSelected(connection, previousBudgetID, selectedBudgetID) {
    // Sets the 'selected' field of the previous budget to 0 (false).
    return new Promise((resolve, reject) => {
        const sql = 'UPDATE budget SET selected = 0 WHERE id = ?';
        connection.query(sql, [previousBudgetID], (error) => {
            if (error) {
                return reject(error);
            } else {
                return resolve();
            }
        });
    }).then(
        () => {
            // Sets the 'selected' field of the selected budget to 1 (true).
            return new Promise((resolve, reject) => {
                const sql = 'UPDATE budget SET selected = 1 WHERE id = ?';
                connection.query(sql, [selectedBudgetID], (error) => {
                    if (error) {
                        return reject(error);
                    } else {
                        return resolve();
                    }
                });
            });
        },
        (error) => {
            return Promise.reject(error);
        }
    );
}
export function deleteBudget(connection, budgetID, userID) {
    return new Promise((resolve, reject) => {
        const sql = 'DELETE FROM budget WHERE id = ? AND user_id = ?';
        return connection.query(sql, [budgetID, userID], (error) => {
            if (error) {
                return reject(error);
            } else {
                return resolve();
            }
        })
    })
}

// Account
export function createAccount(connection, name, initialBalance, budgetID) {
    return new Promise((resolve, reject) => {
        const sql = 'INSERT INTO account (id,name,initial_balance,budget_id) VALUES (?,?,?,?)';
        connection.query(sql, [uuidv4(), name, initialBalance, budgetID], (error) => {
            if (error) {
                return reject(error);
            } else {
                return resolve(new Account(name, initialBalance));
            }
        })
    });
}
export function readAccounts(connection, budgetID) {
    return new Promise((resolve, reject) => {
        const sql = 'SELECT * FROM account WHERE budget_id = ?';
        connection.query(sql, [budgetID], (error, result) => {
            if (error) {
                return reject(error);
            } else {
                const accounts = [];
                for (let row of result) {
                    accounts.push(new Account(row.name, row.initial_balance));
                }
                return resolve(accounts);
            }
        });
    });
}
export function updateAccountName(connection, newName, accountID, budgetID) {
    return new Promise((resolve, reject) => {
        const sql = 'UPDATE account SET name = ? WHERE id = ? AND budget_id = ?';
        connection.query(sql, [newName, accountID, budgetID], (error) => {
            if (error) {
                return reject(error);
            } else {
                return resolve();
            }
        });
    });
}
export function updateAccountInitialBalance(connection, newInitialBalance, accountID, budgetID) {
    return new Promise((resolve, reject) => {
        const sql = 'UPDATE account SET initial_balance = ? WHERE id = ? AND budget_id = ?';
        connection.query(sql, [newInitialBalance, accountID, budgetID], (error) => {
            if (error) {
                return reject(error);
            } else {
                return resolve();
            }
        });
    });
}
export function deleteAccount(connection, name, budgetID) {
    return new Promise((resolve, reject) => {
        const sql = 'DELETE FROM account WHERE name = ? AND budget_id = ?';
        connection.query(sql, [name, budgetID], (error) => {
            if (error) {
                return reject(error);
            } else {
                return resolve()
            }
        })
    });
}

// Category
export function createCategory(connection, position, name, budgetID) {
    return new Promise((resolve, reject) => {
        const categoryID = uuidv4();
        const sql = 'INSERT INTO category (id,position,name,budget_id) VALUES (?,?,?,?)';
        connection.query(sql, [categoryID, position, name, budgetID], (error) => {
            if (error) {
                return reject(error);
            } else {
                return resolve(new Category(categoryID, position, name));
            }
        })
    });
}
export function readCategories(connection, budgetID) {
    return new Promise((resolve, reject) => {
        const sql = 'SELECT * FROM category WHERE budget_id = ?';
        connection.query(sql, [budgetID], (error, result) => {
            if (error) {
                return reject(error);
            } else {
                const categories = [];
                for (let row of result) {
                    categories.push(new Category(row.id, row.position, row.name));
                }
                categories.sort((a, b) => a.getPosition() - b.getPosition());
                return resolve(categories);
            }
        })
    });
}
export function updateCategoryPosition(connection, newPosition, categoryID, budgetID) {
    return new Promise((resolve, reject) => {
        const sql = 'UPDATE category SET position = ? WHERE id = ? AND budget_id = ?';
        connection.query(sql, [newPosition, categoryID, budgetID], (error) => {
            if (error) {
                return reject(error);
            } else {
                return resolve();
            }
        });
    });
}
export function updateCategoryName(connection, newName, categoryID, budgetID) {
    return new Promise((resolve, reject) => {
        const sql = 'UPDATE category SET name = ? WHERE id = ? AND budget_id = ?';
        connection.query(sql, [newName, categoryID, budgetID], (error) => {
            if (error) {
                return reject(error);
            } else {
                return resolve();
            }
        });
    });
}
export function deleteCategory(connection, categoryID, budgetID) {
    return new Promise((resolve, reject) => {
        const sql = 'DELETE FROM category WHERE id = ? AND budget_id = ?';
        connection.query(sql, [categoryID, budgetID], (error) => {
            if (error) {
                return reject(error);
            } else {
                return resolve()
            }
        })
    });
}

// Subcategory
export function createSubcategory(connection, position, name, budgetID, categoryID) {
    return new Promise((resolve, reject) => {
        const subcategoryID = uuidv4();
        const sql = 'INSERT INTO subcategory (id,position,name,budget_id,category_id) VALUES (?,?,?,?,?)';
        connection.query(sql, [subcategoryID, position, name, budgetID, categoryID], (error) => {
            if (error) {
                return reject(error);
            } else {
                return resolve(new Subcategory(subcategoryID, position, name));
            }
        });
    });
}
export function readSubcategories(connection, budgetID, categoryID) {
    return new Promise((resolve, reject) => {
        const sql = 'SELECT * FROM subcategory WHERE budget_id = ? AND category_id = ?';
        connection.query(sql, [budgetID, categoryID], (error, result) => {
            if (error) {
                return reject(error);
            } else {
                const subcategories = [];
                for (let row of result) {
                    subcategories.push(new Subcategory(row.id, row.position, row.name));
                }
                subcategories.sort((a, b) => a.getPosition() - b.getPosition());
                return resolve(subcategories);
            }
        })
    });
}
export function updateSubcategoryPosition(connection, newPosition, subcategoryID, budgetID) {
    return new Promise((resolve, reject) => {
        const sql = 'UPDATE subcategory SET position = ? WHERE id = ? AND budget_id = ?';
        connection.query(sql, [newPosition, subcategoryID, budgetID], (error) => {
            if (error) {
                return reject(error);
            } else {
                return resolve();
            }
        });
    });
}
export function updateSubcategoryName(connection, newName, subcategoryID, budgetID) {
    return new Promise((resolve, reject) => {
        const sql = 'UPDATE subcategory SET name = ? WHERE id = ? AND budget_id = ?';
        connection.query(sql, [newName, subcategoryID, budgetID], (error) => {
            if (error) {
                return reject(error);
            } else {
                return resolve();
            }
        });
    });
}
export function updateSubcategoryParent(connection, newCategoryID, subcategoryID, budgetID) {
    return new Promise((resolve, reject) => {
        const sql = 'UPDATE subcategory SET category_id = ? WHERE id = ? AND budget_id = ?';
        connection.query(sql, [newCategoryID, subcategoryID, budgetID], (error) => {
            if (error) {
                return reject(error);
            } else {
                return resolve();
            }
        });
    });
}
export function deleteSubcategory(connection, subcategoryID, budgetID) {
    return new Promise((resolve, reject) => {
        const sql = 'DELETE FROM subcategory WHERE id = ? AND budget_id = ?';
        connection.query(sql, [subcategoryID, budgetID], (error) => {
            if (error) {
                return reject(error);
            } else {
                return resolve()
            }
        })
    });
}

// Unassigned Category & Subcategory
export function createUnassignedCategory(connection, budgetID) {
    const unassignedID = uuidv4();
    const unassignedCategoryName = 'Unassigned Category';
    const unassginedSubcategoryName = 'Unassigned Subcategory';
    return new Promise((resolve, reject) => {
        const sql = 'INSERT INTO category (id,position,name,budget_id) VALUES (?,?,?,?)';
        connection.query(sql, [unassignedID, -1, unassignedCategoryName, budgetID], (error) => {
            if (error) {
                return reject(error);
            } else {
                return resolve();
            }
        })
    }).then(
        () => {
            return new Promise((resolve, reject) => {
                const sql = 'INSERT INTO subcategory (id,position,name,budget_id,category_id) VALUES (?,?,?,?,?)';
                connection.query(sql, [unassignedID, -1, unassginedSubcategoryName, budgetID, unassignedID], (error) => {
                    if (error) {
                        return reject(error);
                    } else {
                        return resolve(unassignedID);
                    }
                });
            });
        },
        (error) => {
            return Promise.reject(error);
        }
    );
}

// Allocation
export function createAllocation(connection, year, month, balance, subcategoryID) {
    return new Promise((resolve, reject) => {
        const allocationID = uuidv4();
        const sql = 'INSERT INTO allocation (id,year,month,balance,subcategory_id) VALUES (?,?,?,?,?)';
        connection.query(sql, [allocationID, year, month, balance, subcategoryID], (error) => {
            if (error) {
                return reject(error);
            } else {
                return resolve(new Allocation(allocationID, year, month, balance));
            }
        })
    });
}
export function readAllocations(connection, subcategoryID) {
    return new Promise((resolve, reject) => {
        const sql = 'SELECT * FROM allocation WHERE subcategory_id = ?';
        connection.query(sql, [subcategoryID], (error, result) => {
            if (error) {
                return reject(error);
            } else {
                const allocations = [];
                for (let row of result) {
                    allocations.push(new Allocation(row.id, row.year, row.month, parseFloat(row.balance)));
                }
                return resolve(allocations)
            }
        })
    });
}
export function deleteAllocation(connection, allocationID, subcategoryID) {
    return new Promise((resolve, reject) => {
        const sql = 'DELETE FROM allocation WHERE id = ? AND subcategory_id = ?';
        connection.query(sql, [allocationID, subcategoryID], (error) => {
            if (error) {
                return reject(error);
            } else {
                return resolve()
            }
        })
    });
}
export function updateAllocationBalance(connection, newBalance, allocationID, subcategoryID) {
    return new Promise((resolve, reject) => {
        const sql = 'UPDATE allocation SET balance = ? WHERE id = ? AND subcategory_id = ?';
        return connection.query(sql, [newBalance, allocationID, subcategoryID], (error) => {
            if (error) {
                return reject(error);
            } else {
                return resolve();
            }
        });
    });
}

// Payees
export function createPayees(connection, budgetID) {
    return new Promise((resolve, reject) => {
        const payeesID = uuidv4();
        const sql = 'INSERT INTO payees (id,names,budget_id) VALUES (?,?,?)';
        connection.query(sql, [payeesID, '[]', budgetID], (error) => {
            if (error) {
                return reject(error);
            } else {
                return resolve(payeesID);
            }
        })
    });
}
export function readPayees(connection, budgetID) {
    return new Promise((resolve, reject) => {
        const sql = 'SELECT * FROM payees WHERE budget_id = ?';
        connection.query(sql, [budgetID], (error, result) => {
            if (error) {
                return reject(error);
            } else {
                return resolve(result[0].names)
            }
        })
    });
}
export function updatePayees(connection, payeesJSON, budgetID) {
    return new Promise((resolve, reject) => {
        const sql = 'UPDATE payees SET names = ? WHERE budget_id = ?';
        connection.query(sql, [payeesJSON, budgetID], (error) => {
            if (error) {
                return reject(error);
            } else {
                return resolve()
            }
        })
    });
}
export function deletePayees(connection, payeesID, budgetID) {
    return new Promise((resolve, reject) => {
        const sql = 'DELETE FORM payees WHERE id = ? AND budget_id = ?';
        connection.query(sql, [payeesID, budgetID], (error) => {
            if (error) {
                return reject(error);
            } else {
                return resolve()
            }
        })
    });
}

// Transaction
export function createTransaction(connection, date, payee, memo, balance, approval, budgetID, accountID, categoryID, subcategoryID) {
    return new Promise((resolve, reject) => {
        if (accountID === NIL_UUID || categoryID === NIL_UUID || subcategoryID === NIL_UUID) {
            const sql = 'SET foreign_key_checks = 0';
            connection.query(sql, (error) => {
                if (error) {
                    return reject(error);
                } else {
                    return resolve()
                }
            });
        } else {
            return resolve();
        }
    }).then(
        () => {
            return new Promise((resolve, reject) => {
                const transactionID = uuidv4();
                const sql = 'INSERT INTO transaction (id,date,payee,memo,balance,approval,budget_id,account_id,category_id,subcategory_id) VALUES (?,?,?,?,?,?,?,?,?,?)';
                connection.query(sql, [transactionID, date, payee, memo, balance, approval, budgetID, accountID, categoryID, subcategoryID], (error) => {
                    if (error) {
                        return reject(error);
                    } else {
                        return resolve(new Transaction(transactionID, date, payee, memo, balance, approval, accountID, categoryID, subcategoryID));
                    }
                });
            }).then(
                (transaction) => {
                    return new Promise((resolve, reject) => {
                        if (accountID === NIL_UUID || categoryID === NIL_UUID || subcategoryID === NIL_UUID) {
                            const sql = 'SET foreign_key_checks = 1';
                            connection.query(sql, (error) => {
                                if (error) {
                                    return reject(error);
                                } else {
                                    return resolve(transaction);
                                }
                            });

                        } else {
                            return resolve(transaction);
                        }
                    });
                },
                (error) => {
                    return Promise.reject(error);
                }
            );
        },
        (error) => {
            return Promise.reject(error);
        }
    );
}
export function readTransactions(connection, budgetID) {
    return new Promise((resolve, reject) => {
        const sql = 'SELECT * FROM transaction WHERE budget_id = ?';
        connection.query(sql, [budgetID], (error, result) => {
            if (error) {
                return reject(error);
            } else {
                const transactions = [];
                for (let row of result) {
                    transactions.push(new Transaction(row.id, row.date, row.payee, row.memo, row.balance, row.approval, row.account_id, row.category_id, row.subcategory_id));
                }
                return resolve(transactions);
            }
        })
    });
}
export function updateTransactionDate(connection, newDate, transactionID, budgetID) {
    return new Promise((resolve, reject) => {
        const sql = 'UPDATE transaction SET date = ? WHERE id = ? AND budget_id = ?';
        return connection.query(sql, [newDate, transactionID, budgetID], (error) => {
            if (error) {
                return reject(error);
            } else {
                return resolve();
            }
        });
    });
}
export function updateTransactionPayee(connection, newPayee, transactionID, budgetID) {
    return new Promise((resolve, reject) => {
        const sql = 'UPDATE transaction SET payee = ? WHERE id = ? AND budget_id = ?';
        return connection.query(sql, [newPayee, transactionID, budgetID], (error) => {
            if (error) {
                return reject(error);
            } else {
                return resolve();
            }
        });
    });
}
export function updateTransactionMemo(connection, newMemo, transactionID, budgetID) {
    return new Promise((resolve, reject) => {
        const sql = 'UPDATE transaction SET memo = ? WHERE id = ? AND budget_id = ?';
        return connection.query(sql, [newMemo, transactionID, budgetID], (error) => {
            if (error) {
                return reject(error);
            } else {
                return resolve();
            }
        });
    });
}
export function updateTransactionBalance(connection, newBalance, transactionID, budgetID) {
    return new Promise((resolve, reject) => {
        const sql = 'UPDATE transaction SET balance = ? WHERE id = ? AND budget_id = ?';
        return connection.query(sql, [newBalance, transactionID, budgetID], (error) => {
            if (error) {
                return reject(error);
            } else {
                return resolve();
            }
        });
    });
}
export function updateTransactionApproval(connection, newApproval, transactionID, budgetID) {
    return new Promise((resolve, reject) => {
        const sql = 'UPDATE transaction SET approval = ? WHERE id = ? AND budget_id = ?';
        return connection.query(sql, [newApproval, transactionID, budgetID], (error) => {
            if (error) {
                return reject(error);
            } else {
                return resolve();
            }
        });
    });
}
export function updateTransactionAccount(connection, newAccountID, transactionID, budgetID) {
    return new Promise((resolve, reject) => {
        const sql = 'UPDATE transaction SET account_id = ? WHERE id = ? AND budget_id = ?';
        return connection.query(sql, [newAccountID, transactionID, budgetID], (error) => {
            if (error) {
                return reject(error);
            } else {
                return resolve();
            }
        });
    });
}
export function updateTransactionCategories(connection, newCategoryID, newSubcategoryID, transactionID, budgetID) {
    return new Promise((resolve, reject) => {
        const sql = 'UPDATE transaction SET category_id = ?, subcategory_id = ? WHERE id = ? AND budget_id = ?';
        return connection.query(sql, [newCategoryID, newSubcategoryID, transactionID, budgetID], (error) => {
            if (error) {
                return reject(error);
            } else {
                return resolve();
            }
        });
    })
}
export function deleteTransaction(connection, transactionID, budgetID) {
    return new Promise((resolve, reject) => {
        const sql = 'DELETE FROM transaction WHERE id = ? AND budget_id = ?';
        return connection.query(sql, [transactionID, budgetID], (error) => {
            if (error) {
                return reject(error);
            } else {
                return resolve();
            }
        })
    });
}

const myLocale = 'en-US';
const myCurr = 'USD';
const myUserID = '7175fe96-4cb9-4d94-ac87-6e6c160d65ef';
const myDate = new Date().toISOString().slice(0, 19).replace('T', ' ');
const myName = 'New Budget 34'
const myBudgetID = '94e93fed-6660-45cd-8f13-671aa63afc61'
const catEssentialID = '3029e2a1-3e47-4ae5-bfe8-5baf12967bfb'
const catNonessentialID = '8ada8d44-5c90-4f23-b955-fb42bf869e49'
const creditID = 'f94fd09c-93b2-4b15-8b10-d2eca3fb656c'
const checkingID = '01e5ae92-425e-44c9-b523-14ce68a15b13'
const foodID = 'c6e243ce-4622-4e1e-9e68-59582617363d'
const gasID = '816f9541-1852-4660-8f49-9fdded614955'
const videoID = '801d00c8-adbc-4a23-8ec4-a1980bdb1353'
const crunchyID = '6123a18a-b5e5-48f7-b597-7469c229273c'


updateAllocationBalance(myconnection, 120.00, '60088b58-26a1-4b2e-b141-adb958575e5f', '816f9541-1852-4660-8f49-9fdded614955').then(
    () => {
        console.log('done')
    },
    (error) => {
        console.error(error)
    }
)

