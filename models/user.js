export class User {
    #id;
    #email;
    #password;
    #name;
    #dateCreated;
    #budgets = [];
    constructor(id, email, password, name, dateCreated) {
        this.#id = id;
        this.#email = email;
        this.#password = password;
        this.#name = name;
        this.#dateCreated = dateCreated;
    }

    getUserID() {
        return this.#id;
    }
    getEmail() {
        return this.#email;
    }
    getPassword() {
        return this.#password;
    }
    getUsername() {
        return this.#name;
    }
    getDateCreated() {
        return this.#dateCreated;
    }
    getBudgetSize() {
        return this.#budgets.length;
    }

    createBudget(newBudget) {
        this.#budgets.push(newBudget);
        this.#budgets.sort((b1, b2) => {
            if (b1.dateCreated < b2.dateCreated) {
                return -1;
            }
            if (b1.dateCreated > b2.dateCreated) {
                return 1;
            }
            return 0;
        });
    }


}