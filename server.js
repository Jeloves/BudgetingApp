import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { loginRouter } from './routes/login.js';

const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.static(path.join(__dirname, 'scripts')));
app.use('/login', loginRouter);

app.get('/', (request,result) => {
    result.render('index');
    console.log('Index view rendered.');
});

app.listen(3000, () => {
    console.log('Server is listening.');
}); 

