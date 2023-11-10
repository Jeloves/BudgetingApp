import { v4 as uuidv4 } from 'uuid';
import * as mysql from 'mysql2';
import express from 'express';

let connection = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "gengiW-temmy2-wahnap",
    database: "user_data"
});

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

/*
export class UserModel {
    #currentUser;

    setCurrentUser(username, email, date) {
        currentUser = new User('user_id_' + uuidv4(), username, 'user_password_' + uuidv4(), email, date);
        console.log(currentUser);
    }
    validateUserCredentials(username, password) {
        connection.connect(function (err) {
            if (err) throw err;
            var sql = `SELECT * FROM user WHERE username = '${username}' AND password = '${password}'`;
            connection.query(sql, function (err, result) {
                if (err) throw err;
                this.setCurrentUser(result[0].username,result[0].email,result[0].date);
            });
        });
    }
}
*/

const app = express();

app.use((req,res) => {
    console.log('New request sent.');
    res.send('<h1>New request, wow!</h1>');
})

app.listen(443, 'jelo.github.io', ()=> {
    console.log("Listening on Port8080");
})
