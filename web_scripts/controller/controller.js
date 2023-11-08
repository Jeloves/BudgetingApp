import { UnitTest } from "../../tests/unit_test.js";
import { User } from "../model/user.js";
import { Budget } from "../model/budget.js";

export class Controller {
    #user = null;
    #selectedBudget = null;
    getUser() {
        return this.#user;
    }


    createUser(userID,email,password,userName,budgetID,budgetName,dateCreated) {
        this.#user = new User(userID,email,password,userName,dateCreated);
        const newBudget = new Budget(budgetID,budgetName,dateCreated);
        this.#user.createBudget(newBudget);
        this.#selectedBudget = newBudget;
    }
    signInUser(user) {
        this.#user = user;
    }

    createCategory(name) {
        const newCategory = new Category(name);
        
    }

}