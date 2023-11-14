import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { loginUser } from './models/user.js';

const app = express();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '/views'));

app.use(express.static('scripts'));
app.get('/login', (request,result) => {
    result.render('login');
    console.log('Login view rendered.');
});

app.use(express.urlencoded({extended: true}))
app.post('/login', (request, result) => {
    let username = request.body.username;
    let password = request.body.password;
    console.log('Attempting login...');
    loginUser(username,password).then(()=>{
        result.redirect('/');
    });
});

app.get('/', (request,result) => {
    result.render('index');
    console.log('Index view rendered.');
});

app.listen(3000, () => {
    console.log('Server is listening.');
});