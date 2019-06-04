import { expect } from "chai";
import * as _ from "lodash";
import {ConsoleInputReader} from "./console_input_reader";
import {InputKeys} from "./input_reader";

describe("ConsoleInputReader tests", () => {
   it("should read all input keys in order", async () => {
       const inputKeysShuffled = _.shuffle(InputKeys);
       const reader = new ConsoleInputReader(true);

       for (const key of inputKeysShuffled) {
           const p = reader.readInputKey();
           reader.triggerInputKeyPress(key);
           const inKey = await p;
           expect(inKey).to.equal(key);
       }
   });
   it("should ignore unmapped key presses", async () => {
       const inputKeysShuffled = _.shuffle(InputKeys);
       const reader = new ConsoleInputReader(true);

       for (const key of inputKeysShuffled) {
           const p = reader.readInputKey();
           reader.triggerKeyPress("~");
           reader.triggerInputKeyPress(key);
           const inKey = await p;
           expect(inKey).to.equal(key);
       }
   });
});
