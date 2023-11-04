import { Controller } from "../web_scripts/controller/controller.js";

export class ControllerTest {
    #testController = new Controller();
    constructor() {
        this.testCreateUser();
    }
    testCreateUser() {
        const expectedUserID = 'user_id';
        const expectedEmail = 'test@email.com';
        const expectedPassword = 'password';
        const expectedUsername = 'Terrence Tester';

        const expectedBudgetID = 'budget_id';
        const expectedBudgetName = 'Terrence\'s Budget';
        const expectedDateString = `${new Date().getFullYear()}/${new Date().getMonth()}/${new Date().getDate()}`;

        this.#testController.createUser(expectedUserID,expectedEmail,expectedPassword,expectedUsername,expectedBudgetID,expectedBudgetName,new Date());
        const actualUser = this.#testController.getUser();
        const actualDateString = `${actualUser.getDateCreated().getFullYear()}/${actualUser.getDateCreated().getMonth()}/${actualUser.getDateCreated().getDate()}`;

        if (actualUser.getUserID() !== expectedUserID) {
            console.error(`/controller.js/createUser/userID= ${actualUser.getUserID()}, expected= ${expectedUserID}`);
        }
        if (actualUser.getEmail() !== expectedEmail) {
            console.error(`/controller.js/createUser/email= ${actualUser.getUserID()}, expected= ${expectedEmail}`);
        }
        if (actualUser.getPassword() !== expectedPassword) {
            console.error(`/controller.js/createUser/password= ${actualUser.getPassword()}, expected= ${expectedPassword}`);
        }
        if (actualUser.getUsername() !== expectedUsername) {
            console.error(`/controller.js/createUser/username= ${actualUser.getUsername()}, expected= ${expectedUsername}`);
        }
        if (actualDateString !== expectedDateString) {
            console.error(`/controller.js/createUser/dateString= ${actualDateString}, expected= ${expectedDateString}`);
        }
    }
}
