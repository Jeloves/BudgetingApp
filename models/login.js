import { credentialValidationError, sessionValidationError } from '../errors.js';

export function validateUserCredentials(connection, username, password) {
    return new Promise((resolve, reject) => {
        const sql = `SELECT * FROM user WHERE username = '${username}' AND password = '${password}'`;
        return connection.query(sql, (error, result) => {
            // Error cases for validating user credentials with database information.
            if (error) {
                console.error(`Failed to validate credentials: ${error}`);
                return reject();
            } else if (result.length === 1) {
                console.log('Login credentials validated');
                return resolve(result[0].id);
            } else {
                console.error(credentialValidationError);
                return reject();
            }
        });
    });
}
export function loginUser(connection, sessionID, userID) {
    return new Promise((resolve, reject) => {
        const sql = `UPDATE session SET userID = '${userID}' WHERE sessionID = '${sessionID}'`;
        return connection.query(sql, (error, result) => {
            if (error) {
                console.error(`Failed to login user: ${error}`);
                return reject();
            } else {
                console.log('Login successful');
                return resolve();
            }
        });
    });
}

export function validateSessionID(connection, sessionID) {
    return new Promise((resolve, reject) => {
        const sql = `SELECT * FROM session WHERE sessionID = '${sessionID}'`;
        return connection.query(sql, (error, result) => {
            if (error) {
                console.error(`Failed to validate session: ${error}`);
                return reject();
            } else if (result.length === 1) {
                console.log('Session validated');
                return resolve(result[0].userID);
            } else {
                console.error(sessionValidationError);
                return reject();
            }
        });
    });
}