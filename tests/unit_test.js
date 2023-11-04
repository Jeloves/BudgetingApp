import { startModelTests } from "./model_tests.js";
import { ControllerTest } from "./controller_tests.js";

export class UnitTest {
    constructor() {
        startModelTests();
        new ControllerTest();
    }
}
