import express from 'express';
import * as mysql from 'mysql2';
import path from 'path';
import { fileURLToPath } from 'url';
import cookieParser from 'cookie-parser';
import { v4 as uuidv4 } from 'uuid';

import session from 'express-session';
import MySQLStoreCreator from 'express-mysql-session';




const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '/views'));

app.use(cookieParser());
app.use(express.static(path.join(__dirname, '/scripts')));

export const connection = mysql.createConnection({
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

const cookieSecret = uuidv4();
const MySQLStore = MySQLStoreCreator(session);
const sessionStore = new MySQLStore(storeOptions, connection);
app.use(session({
    secret: cookieSecret,
    saveUninitialized: true,
    store: sessionStore,
    cookie: { maxAge: 30000 },
    resave: false
}));

app.get('/', (request, result) => {
    result.render('budget');
});



app.post('/', (request, result) => {
    result.render('budget');
    setSessionUserID(request.session.id, '63e0afc2-3b20-4646-bb4c-25eef32ef1f1').then(
        function resolved() {
            console.log('Success')
        },
        function rejeted(error) {
            console.log(error)
        });
});

app.listen(4000, () => {
    console.log('Server 4000 is listening.');
});

function setSessionUserID(sessionID, userID) {
    return new Promise((resolve, reject) => {
        const sql = `UPDATE session SET userID = '${userID}' WHERE sessionID = '${sessionID}'`;
        return connection.query(sql, (error) => {
            if (error) {
                return reject(error);
            } else {
                return resolve();
            }
        })
    })
}










