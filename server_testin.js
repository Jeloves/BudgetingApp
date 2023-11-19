import express from 'express';
import * as mysql from 'mysql2';
import path from 'path';
import { fileURLToPath } from 'url';
import { v4 as uuidv4 } from 'uuid';
import session from 'express-session';
import MySQLStoreCreator from 'express-mysql-session';
import { credentialValidationError } from './errors.js';

const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '/views'));

app.use(express.static(path.join(__dirname, '/scripts')));

const connection = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "gengiW-temmy2-wahnap",
    database: "user_data"
});
const storeOptions = {
    clearExpired: true,
    // How frequently expired sessions will be cleared; milliseconds:
    checkExpirationInterval: 30000,
    // The maximum age of a valid session; milliseconds:
    expiration: 30000,
    createDatabaseTable: false,
    schema: {
        tableName: 'session',
        columnNames: {
            session_id: 'sessionID',
            expires: 'expires',
            data: 'data',
        }
    }
}
const MySQLStore = MySQLStoreCreator(session);
const sessionStore = new MySQLStore(storeOptions, connection);

app.use(session({
    secret: uuidv4(),
    saveUninitialized: true,
    store: sessionStore,
    cookie: { maxAge: 30000 },
    resave: false
}));

app.get('/', (request, result) => {
    result.render('login');
});


app.use(express.urlencoded({ extended: true }))
app.post('/', (request, result) => {
    validateUserCredentials(request.body.username, request.body.password).then(
        function resolved(userID) {
            if (setSessionUserID(request.session.id, userID)) {
                result.redirect('budget');
            }
        },
        function rejected(error) {
            console.error(`Failed to validate credentials: ${error}`);
        });
});

app.listen(4000, () => {
    console.log('Server 4000 is listening.');
});

function setSessionUserID(sessionID, userID) {
    const promise = new Promise((resolve, reject) => {
        const sql = `UPDATE session SET userID = '${userID}' WHERE sessionID = '${sessionID}'`;
        return connection.query(sql, (error) => {
            if (error) {
                console.error(`Failed to update session userID: ${error}`);
                return reject(error);
            } else {
                return resolve();
            }
        });
    });
    promise.then(
        function resolved() {
            return true;
        },
        function rejected() {
            return false;
        });
}
function validateUserCredentials(username, password) {
    return new Promise((resolve, reject) => {
        const sql = `SELECT * FROM user WHERE username = '${username}' AND password = '${password}'`;
        return connection.query(sql, (error, result) => {
            // Error cases for validating user credentials with database information.
            if (error) {
                return reject(error);
            } else if (result.length === 1) {
                return resolve(result[0].id);
            } else {
                return reject(credentialValidationError);
            }
        });
    });
}









