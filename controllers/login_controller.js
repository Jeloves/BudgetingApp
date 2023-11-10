import express from 'express';
import { UserModel } from '../models/user.js';

export class LoginController {
    #userModel = new UserModel();

    async loginUser(username, password) {
        const error = await this.#userModel.loginUser(username, password);
        if (error !== null) {
            console.e(data.error)
        } else {
            console.log(`User Login Successful: ${this.#userModel.getCurrentUser().getName()}`);
        }
    }
}

let con = new LoginController();
con.loginUser('User01','password1234')

/*
const app = express();
app.get('/ ', (req, res) => {
    console.log('here');
    res.
});

app.listen(3000, () => {
    console.log('Server is listening.')
});

*/