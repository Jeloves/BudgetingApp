import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

const port = 4000;
const app = express();
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(path.dirname(__filename));
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '/frontend_views'));
app.use(express.static(path.join(__dirname, '/scripts')));
app.use(express.static(path.join(__dirname, '/content')));

app.use('/', (request, response) => {
    response.render('frontend');
});
app.listen(port, () => {
    console.log(`Frontend Server is listening on port ${port}`);
});