import * as mysql from 'mysql2';
import { v4 as uuidv4 } from 'uuid';
import { Budget } from './budget.js';
import { setSessionCookie } from '../scripts/login_script.js';
import { credentialValidationError } from '../errors.js'
import { uuid } from 'uuidv4';

class User {
    #name;
    #email;
    #date;
    constructor(name, email, date) {
        this.#name = name;
        this.#email = email;
        this.#date = date;
    }
    getName() {
        return this.#name;
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

export async function validateUserCredentials(username, password) {
    const validationPromise = new Promise((resolve, reject) => {
        const sql = `SELECT * FROM user WHERE username = '${username}' AND password = '${password}'`;
        return connection.query(sql, (error, result) => {
            // Error cases for validating user credentials with database information.
            if (error) {
                return reject(error);
            } else if (result.length === 1) {
                return resolve(result[0]);
            } else {
                return reject(credentialValidationError);
            }
        });
    });
    return validationPromise.then(
        (result) => {
            console.log('User credentials validated.')
            return loginUser(result.id, result.name, result.email, result.date);
        },
        (error) => {
            console.error(`User credentials invalid: ${error}`);
            return new Promise((resolve, reject) => {
                reject();
            });
        });
}

async function loginUser(userID, username, email, date) {
    return new Promise((resolve, reject) => {
        const sessionCreated = createUserSession();
        return sessionCreated.then(
            (sessionID) => {
                return startUserSession(sessionID, userID).then(
                    () => {
                        currentUser = new User(username, email, date);
                        return resolve(sessionID);
                    },
                    () => {
                        return reject()
                    });
            },
            () => {
                return reject()
            });
    });
}


async function createUserSession() {
    const sessionID = uuidv4();
    return new Promise((resolve, reject) => {
        const sql = `INSERT INTO session (id, idle) VALUES ('${sessionID}', 1)`;
        return connection.query(sql, (error) => {
            if (error) {
                console.error(`User session could not be created: ${error}`);
                return reject(error);
            } else {
                console.log('User session created.');
                return resolve(sessionID);
            }
        });
    });
}
async function startUserSession(sessionID, userID) {
    return new Promise((resolve, reject) => {
        const sql = `INSERT INTO session_user (sessionID, userID) VALUES ('${sessionID}', '${userID}')`;
        return connection.query(sql, (error) => {
            if (error) {
                console.error(`User session failed to start: ${error}`);
                return reject(error);
            } else {
                console.log('User session started.');
                return resolve();
            }
        });
    });
}
async function endUserSession(sessionID) {
    return new Promise((resolve, reject) => {
        const sql = `DELETE * FROM session_user WHERE sessionID = '${sessionID}'`;
        return connection.query(sql, (error) => {
            if (error) {
                console.error(`User session failed to end: ${error}`);
                return reject(error);
            } else {
                console.log('User session ended.');
                return resolve();
            }
        });
    })
}






