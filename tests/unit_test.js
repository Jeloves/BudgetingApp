import { ModelTest } from "./model_tests.js";
import { ControllerTest } from "./controller_tests.js";

import pkg from "unit.js";
const { UnitJS } = pkg;


export class UnitTest {
    constructor() {
        new ModelTest();
        new ControllerTest();
    }
}