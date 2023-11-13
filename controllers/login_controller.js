import { UserModel } from '../models/user.js';
import express from 'express';

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

const model = new UserModel();
export async function validateUserCredentials(username, password) {
    const error = await model.loginUser(username, password);
    if (error !== null) {
        console.e(data.error)
    } else {
        console.log(`User Login Successful: ${model.getCurrentUser().getName()}`);
        return model.getCurrentUser();
    }
}
