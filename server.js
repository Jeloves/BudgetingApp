import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { loginRouter } from './routes/login.js';
import cookieParser from 'cookie-parser';

const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '/views'));

app.use(cookieParser());
app.use(express.static(path.join(__dirname, '/scripts')));
app.use('/login', loginRouter);

app.get('/', (request,result) => {
    result.render('index');
    console.log(getSessionID(request));
    console.log('Index view rendered.');
});

app.listen(3000, () => {
    console.log('Server is listening.');
}); 

function getSessionID(request) {
    return request.cookies.sessionID;
}

