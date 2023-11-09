const User = require('./models/classes.js');



const { v4: uuidv4 } = require('uuid')
var mysql = require('mysql2');
const express = require('express');
const app = express();
const port = 3000;

var connection = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "gengiW-temmy2-wahnap",
    database: "user_data"
});


// A new user is created.
/*
const newUserID = 'user_' + uuidv4()
const jelo = new User(newUserID, 'User01', 'password1234', 'email@gmail.com', '2023-11-09')
function addNewUserToDatabase(user) {
    const id = user.getID();
    const name = user.getName();
    const password = user.getPassword();
    const email = user.getEmail();
    const date = user.getDate();
    connection.connect(function (err) {
        if (err) throw err;
        console.log("Connected!");
        var sql = `INSERT INTO user (id, username, password, email, date) VALUES ('${id}','${name}','${password}','${email}','${date}')`;
        connection.query(sql, function (err, result) {
            if (err) throw err;
            console.log("1 user inserted");
        });
    });
}
addNewUserToDatabase(jelo)
*/

// The existing user is signed in.
let signedInUser = null;

function signInUser(username,password) {
    connection.connect(function (err) {
        if (err) throw err;
        var sql = `SELECT * FROM user WHERE username = '${username}' AND password = '${password}'`;
        connection.query(sql, function (err, result) {
            if (err) throw err;
            signInUser = new User('user_id_'+uuidv4(),username,'user_password_'+uuidv4(),result[0].email,result[0].date);
            console.log(signInUser);
        });
    });
}

signInUser('User01','password1234');
