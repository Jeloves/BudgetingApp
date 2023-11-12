import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
const app = express();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.get('/login/:username', async (request,result) => {
    const {username} = request.params;
    result.send(username);
})

app.listen(3000, () => {
    console.log('Server is listening.')
});