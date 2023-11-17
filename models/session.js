import { v4 as uuidv4 } from 'uuid';
import { connection } from '../server.js';

export class SessionTimer {
    #timer;
    #minutesToElapse;
    constructor(window, minutesToElapse) {
        this.#minutesToElapse = minutesToElapse;
        this.#timer = window.setTimeout(() => {
            console.log('TIMER ENDS');
        }, this.#minutesToElapse * 60000);
    }

    resetTimer(window, minutesToElapse) {
        this.#minutesToElapse = minutesToElapse;
        window.clearTimeout(this.#timer);
    }
}

async function createUserSession() {
    const sessionID = uuidv4();
    return new Promise((resolve, reject) => {
        const sql = `INSERT INTO session (id, idle) VALUES ('${sessionID}', 0)`;
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


