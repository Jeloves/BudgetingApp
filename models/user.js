import * as mysql from 'mysql2';

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

let currentUser = null;

export async function loginUser(username, password) {
    const error = validateCredentials(username, password);
    error.then(()=>{
        switch (error) {
            case true:
                console.error('ERROR: Multiple users with these credentials were found in database.');
            case false:
                console.error('ERROR: Failed to connect to database.');
            case null:
                console.error('ERROR: Credentials were valid, but no user found.');
            default:
                console.log('User signed in.')
                currentUser = new User('userID_' + error.id, error.username, 'userPassword_' + error.password, error.email, error.date);
        }
    }, () => {console.log('Promise rejected logging into user.')});
}

function validateCredentials(username, password) {
    const connection = mysql.createConnection({
        host: "localhost",
        user: "root",
        password: "gengiW-temmy2-wahnap",
        database: "user_data"
    });
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

