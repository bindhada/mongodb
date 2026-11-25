import { describe, it, expect } from "vitest";

describe("Intentional CI failure", () => {
  it("should fail on purpose", () => {
    expect(1).toBe(1);
  });
});