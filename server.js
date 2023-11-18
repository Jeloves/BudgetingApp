import express from 'express';
import * as mysql from 'mysql2';
import path from 'path';
import { fileURLToPath } from 'url';
import { loginRouter } from './routes/login.js';
import { budgetRouter } from './routes/budget.js';
import cookieParser from 'cookie-parser';
import { v4 as uuidv4 } from 'uuid';

import session from 'express-session';
import MySQLStoreCreator from 'express-mysql-session';

const port = 3000;
const connectionHost = 'localhost';
const connectionUser = 'root';
const connectionPassword = 'gengiW-temmy2-wahnap';
const connectionDatabase = 'user_data';
// How frequently expired sessions will be cleared; milliseconds:
const checkSessionExpirationInterval = 60000;
// The maximum age of a valid session; milliseconds:
const sessionExpiration = 60000;

const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '/views'));

app.use(cookieParser());
app.use(express.static(path.join(__dirname, '/scripts')));
app.use('/login', loginRouter);
app.use('/budget', budgetRouter);

export const connection = mysql.createConnection({
    host: connectionHost,
    user: connectionUser,
    password: connectionPassword,
    database: connectionDatabase
});



app.get('/', (request, result) => {

    const MySQLStore = MySQLStoreCreator(session);
    const userID = '63e0afc2-3b20-4646-bb4c-25eef32ef1f1';
    const sessionID = uuidv4();
    const currentDate = new Date();
    const expiresDateTime = new Date(currentDate.getTime() + sessionExpiration);
    const options = {
        host: connectionHost,
        port: port,
        user: connectionUser,
        password: connectionPassword,
        database: connectionDatabase,
        clearExpired: true,
        checkExpirationInterval: checkSessionExpirationInterval,
        expiration: sessionExpiration,
        createDatabaseTable: true   ,
        endConnectionOnClose: true,
        disableTouch: false,
        charset: 'utf8mb4_bin',
        schema: {
            tableName: 'session',
            columnNames: {
                session_id: 'sessionID',
                expires: 'expires',
                data: 'userID',
            }
        }
    }
    const sessionStore = new MySQLStore(options, connection);
    app.set('trust proxy', 1)

    sessionStore.onReady().then(() => {
        console.log('Session store ready.');
        createSession(this)
        console.log(request.session.sessionID)

    }).catch(error => {
        // Something went wrong.
        console.error(error);
    });
    result.render('index');
    console.log('Index view rendered.');
});

app.listen(port, () => {
    console.log('Server is listening.');
});
function createSession(sessionStore) {

    app.use(session({
        key: 'sessionID',
        secret: uuidv4(),
        store: sessionStore,
        genid: () => { return uuidv4(); },
        name: 'sessionID',
        resave: false,
        rolling: true,
        maxAge: 60000,
        saveUninitialized: true,
        cookie: {
            httpOnly: false,
            maxAge: 60000,
            sameSite: 'lax',
            secure: false,
        }
    }));
}





