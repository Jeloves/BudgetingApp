import { ModelTest } from "./model_tests.js";
import { ControllerTest } from "./controller_tests.js";

export class UnitTest {
    constructor() {
        new ModelTest();
        new ControllerTest();
    }
}

new UnitTest();