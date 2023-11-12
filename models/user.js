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

export class UserModel {
    #connection = mysql.createConnection({
        host: "localhost",
        user: "root",
        password: "gengiW-temmy2-wahnap",
        database: "user_data"
    });
    #currentUser;
    #validateCredentials(username, password) {
        return new Promise((resolve, reject) => {
            const sql = `SELECT * FROM user WHERE username = '${username}' AND password = '${password}'`;
            return this.#connection.query(sql, (error, result) => {
                if (error) {
                    return reject(false);
                } else if (result.length === 1) {
                    return resolve(result[0]);
                } else {
                    return reject(true);
                }
            });
        })
    }
    async loginUser(username, password) {
        const data = await this.#validateCredentials(username, password);
        if (data === true) {
            return 'ERROR: Multiple users with these credentials were found in database.';
        } else if (data === false) {
            return 'ERROR: Failed to connect to database.';
        } else if (data !== null) {
            this.#currentUser = new User('userID_' + data.id, data.username, 'userPassword_' + data.password, data.email, data.date);
            return null;
        }
    }
    getCurrentUser() {
        return this.#currentUser;
    }
}
