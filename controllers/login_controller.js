import { UserModel } from "../models/user.js";

class LoginController {
    #userModel = new UserModel();

    signInUser(username,password) {
        this.#userModel.setCurrentUser
    }
}

