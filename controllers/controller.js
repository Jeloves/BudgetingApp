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

