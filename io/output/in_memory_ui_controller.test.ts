import { expect } from "chai";
import {InMemoryTextualUIController} from "./in_memory_ui_controller";

describe("InMemoryUIController tests", () => {
   it("should print content", () => {
       const TEXT = "hello";
       const ui = new InMemoryTextualUIController();
       ui.println(TEXT);
       expect(ui.text).to.equal(TEXT + "\n");
       ui.println(TEXT);
       expect(ui.text).to.equal((TEXT + "\n").repeat(2));
   });
   it("should clear text", () => {
       const TEXT = "hello";
       const ui = new InMemoryTextualUIController();
       ui.println(TEXT);
       expect(ui.text).to.equal(TEXT + "\n");
       ui.clearScreen();
       expect(ui.text).to.equal("");
       ui.println(TEXT);
       expect(ui.text).to.equal(TEXT + "\n");
   });
});
