import express from 'express';
import * as mysql from 'mysql2';
import path from 'path';
import { fileURLToPath } from 'url';
import { v4 as uuidv4 } from 'uuid';
import { loginRouter } from './routes/auth.js';
import { budgetRouter } from './routes/budget.js';
import session from 'express-session';
import MySQLStoreCreator from 'express-mysql-session';
import passport from 'passport'

const port = 3000;
const connectionHost = 'localhost';
const connectionUser = 'root';
const connectionPassword = 'gengiW-temmy2-wahnap';
const connectionDatabase = 'new_leaf_data';
export const connection = mysql.createConnection({
    host: connectionHost,
    user: connectionUser,
    password: connectionPassword,
    database: connectionDatabase,
    namedPlaceholders: true
});
// How frequently expired sessions will be cleared; minutes:
const checkExpirationInterval = 6 * 60;
// The maximum age of a valid session; minutes:
const expiration = 5;   
const storeOptions = {
    clearExpired: true,
	checkExpirationInterval: checkExpirationInterval * 60000,
	expiration: expiration * 60000,
    createDatabaseTable: false,
    schema: {
        tableName: 'session',
        columnNames: {
            session_id: 'session_id',
            expires: 'expires',
            data: 'data',
        }
    }
}
const MySQLStore = MySQLStoreCreator(session);
const sessionStore = new MySQLStore(storeOptions, connection);
sessionStore.onReady().then(() => {
	console.log('MySQLStore initialized');
}).catch(error => {
	console.error(`MySQLStore failed to initialize: ${error}`);
});

const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '/views'));
app.use(express.static(path.join(__dirname, '/scripts')));
app.use(express.static(path.join(__dirname, '/content')));
app.use(session({
    secret: uuidv4(),
    saveUninitialized: true,
    store: sessionStore,
    cookie: { maxAge: expiration * 60000 },
    resave: false
}));
app.use(passport.authenticate('session'));
app.use('/login', loginRouter);
app.use('/budget', budgetRouter);
app.listen(port, () => {
    console.log(`Server is listening on port ${port}`);
});