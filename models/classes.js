class Allocation {
    #category_id;
    #allocation_year;
    #allocation_month;
    #allocation_amount;
}

class Transaction {
    #user_id;
    #budget_id;
    #account_id;
    #category_id;
    #transaction_id;
    #transaction_date;
    #transaction_amount;
    #payee;
}

class Category {
    #user_id;
    #budget_id;
    #category_id;
    #category_name;
    #allocation_ids;
}

class Account {
    #user_id;
    #budget_id;
    #account_id;
    #account_name;
    #account_balance;
}

class Budget {
    #user_id;
    #budget_id;
    #budget_date;
    #budget_name;
    #account_ids
    #category_ids;
    #allocation_ids;
    #transaction_ids;
}

class User {
    #id;
    #name;
    #password;
    #email;
    #date;
    constructor(id,username,password,email,date) {
        this.#id = id;
        this.#name = username;
        this.#password = password;
        this.#email = email;
        this.#date = date;
    }

    getID() {
        return this.#id;
    }
    getName() {
        return this.#name;
    }
    getPassword() {
        return this.#password;
    }
    getEmail() {
        return this.#email;
    }
    getDate() {
        return this.#date;
    }
}

function createNewUser(id,name,password,email) {
    return new User(id,name,password,email);
}

module.exports = User;