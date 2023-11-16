import * as mysql from 'mysql2';
import { v4 as uuidv4 } from 'uuid';
import { Budget } from './budget.js';
import { setSessionCookie } from '../scripts/login_script.js';

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
                const sessionPromise = createSession(user.id);
                sessionPromise.then(() => {
                    
                    // How do we send the sessionID to the client via cookie?



                    
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

async function createSession(userID) {
    const sessionID = 'sesh_' + uuidv4();
    const sessionCreatePromise = new Promise((resolve, reject) => {
        const sql = `INSERT INTO session (id, idle) VALUES ('${sessionID}', 1)`;
        return connection.query(sql, (error, result) => {
            if (error) {
                console.error(error);
                return reject();
            } else {
                return resolve(sessionID);
            }
        });
    });
    sessionCreatePromise.then((sessionID) => {
        const sessionStartPromise = startSession(sessionID, userID);
        sessionStartPromise.then(()=> {
            // TODO -
        });
    });
}
function startSession(sessionID, userID) {
    return new Promise((resolve, reject) => {
        const sql = `INSERT INTO session_user (sessionID, userID) VALUES ('${sessionID}', '${userID}')`;
        return connection.query(sql, (error, result) => {
            if (error) {
                console.error(error);
                return reject()
            } else {
                return resolve()
            }
        });
    });
}


