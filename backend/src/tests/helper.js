import { describe, it, test } from "node:test";
import assert from "assert/strict";
import { calculateFight } from "../utils/helper.js";

test("1", () => {
  describe("calculateFight", () => {
    it("should return attacker survivors", () => {
      assert.equal(calculateFight(8, 4), { attacker: 4 });
    });
  });
});
