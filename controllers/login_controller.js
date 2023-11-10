import { UserModel } from "../models/user.js";

export class LoginController {
    #userModel = new UserModel();

    signInUser(username,password) {
        this.#userModel.setCurrentUser
    }
}

