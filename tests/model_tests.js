import { User } from "../web_scripts/model/user.js";
import { Budget } from "../web_scripts/model/budget.js";

export class ModelTest {

    constructor() {
        this.#testUserConstructor();
        this.#testUserCreateBudget();

        this.#testBudgetConstructor();
    }

    #testUserConstructor() {
        const testDate = new Date('August 19, 1975 23:15:30')
        const testUser = new User('test_id', 'test@email.com', 'password1234', 'Terrence Tester', testDate);
        const testUserID = testUser.getUserID();
        const testUserEmail = testUser.getEmail();
        const testUserPassword = testUser.getPassword();
        const testUserName = testUser.getUsername();
        const testUserDateCreated = testUser.getDateCreated()
        const testUserBudgetSize = testUser.getBudgetSize();

        if (testUserID !== 'test_id') {
            console.error(`user.js/testUserID=${testUserID}, expected= test_id`);
        }
        if (testUserEmail !== 'test@email.com') {
            console.error(`user.js/testUserEmail=${testUserEmail}, expected= test@emailcom`);
        }
        if (testUserPassword !== 'password1234') {
            console.error(`user.js/testUserPassword=${testUserPassword}, expected= password1234`);
        }
        if (testUserName !== 'Terrence Tester') {
            console.error(`user.js/testUserName=${testUserName}, expected= Terrence Tester`);
        }
        const actualDateString = `${testUserDateCreated.getFullYear()}/${testUserDateCreated.getMonth()}/${testUserDateCreated.getDate()}`;
        if (actualDateString !== '1975/7/19') {
            console.error(`user.js/testUserDate=${actualDateString}, expected= 1975/7/19`);
        }
        if (testUserBudgetSize !== 0) {
            console.error(`user.js/testUserBudgetSize=${testUserBudgetSize}, , expected= 0}`);
        }
    }
    #testUserCreateBudget() {
        const todaysDate = new Date()
        const expectedBudgetID = 'budget_id';
        const expectedBudgetName = 'budget_name';
        const expectedBudgetDateString = `${todaysDate.getFullYear()}/${todaysDate.getMonth()}/${todaysDate.getDate()}`;
        const testBudget = new Budget(expectedBudgetID, expectedBudgetName, new Date());

        if (expectedBudgetID !== testBudget.getBudgetID()) {
            console.error(`user.js/createBudget()/budgetID= ${testBudget.getBudgetID()}, expected= ${expectedBudgetID}`);
        }
        if (expectedBudgetName !== testBudget.getName()) {
            console.error(`user.js/createBudget()/budgetName= ${testBudget.getName()}, expected= ${expectedBudgetName}`);
        }
        const actualBudgetDateString = `${testBudget.getDateCreated().getFullYear()}/${testBudget.getDateCreated().getMonth()}/${testBudget.getDateCreated().getDate()}`;
        if (expectedBudgetDateString !== actualBudgetDateString) {
            console.error(`user.js/createBudget()/budgetDateString= ${actualBudgetDateString}, expected= ${expectedBudgetDateString}`);
        }
    }

    // budget.js
    #testBudgetConstructor() {
        const expectedID = 'budget_id';
        const expectedName = 'budget_name';
        const expectedDateString = `${new Date().getFullYear()}/${new Date().getMonth()}/${new Date().getDate()}`;
        const testBudget = new Budget(expectedID, expectedName, new Date());
        const actualDateString = `${testBudget.getDateCreated().getFullYear()}/${testBudget.getDateCreated().getMonth()}/${testBudget.getDateCreated().getDate()}`;
        if (expectedID !== testBudget.getBudgetID()) {
            console.error(`budget.js/constructor/budgetID= ${testBudget.getBudgetID()}, expectedID= ${expectedID}`);
        }
        if (expectedName !== testBudget.getName()) {
            console.error(`budget.js/constructor/budgetName= ${testBudget.getName()}, expectedName= ${expectedName}`);
        }
        if (expectedDateString !== actualDateString) {
            console.error(`budget.js/constructor/budgetDateString= ${actualDateString}, expectedDateString= ${expectedDateString}`);
        }
    }
}
