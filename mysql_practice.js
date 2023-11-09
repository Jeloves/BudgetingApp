const { v4: uuidv4 } = require('uuid')
var mysql = require('mysql2');
const express = require('express');
const app = express();
const port = 3000;

app.get('/', (req, res) => {
    res.send('Hello World!')
})

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})

var connection = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "gengiW-temmy2-wahnap",
    database: "user_data"
});

// A new user is created.
const User = require('./models/classes.js');
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
// addNewUserToDatabase(jelo)

