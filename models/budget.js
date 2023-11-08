export class Budget {
    #id;
    #name;
    #dateCreated;
    constructor(id,name,dateCreated) {
        this.#id = id;
        this.#name = name;
        this.#dateCreated = dateCreated;
    }   

    getBudgetID() {
        return this.#id;
    }
    getName() {
        return this.#name;
    }
    getDateCreated() {
        return this.#dateCreated;
    }
}