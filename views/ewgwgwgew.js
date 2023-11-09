/*
import { Controller } from "../controllers/controller.js";

function uuid(prefix) {     // prefix is the class name as a lowercase string; 'user','budget','category', etc.
    return prefix + '_' + window.crypto.randomUUID();
}

function startActivity() {

    // The controller is initialized.
    const controller = new Controller();

    // The user creates a new user-account, then signs in.
    // The user automatically creates a new budget object.
    const email = 'jelovalera@gmail.com';
    const password = 'password1234';
    const username = 'Anjelo Valera';
    const budgetName = 'Anjelo\'s Budget';
    controller.createUser(uuid('user'), email, password, username, uuid('budget'), budgetName, new Date());

    // The user creates two new categories.
    const categoryName1 = 'Nonessential';
    const categoryName2 = 'Essential';

    controller.createCategory(categoryName1);
    controller.createCategory(categoryName2);
}

if (typeof document !== 'undefined') {  
    startActivity();
}