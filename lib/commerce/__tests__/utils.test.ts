import { describe, expect, it } from "vitest";
import { removeEdgesAndNodes } from "../utils";

describe("removeEdgesAndNodes", () => {
  it("flattens nodes out of a GraphQL connection", () => {
    const connection = {
      edges: [
        { node: { id: 1 } },
        { node: { id: 2 } },
        { node: { id: 3 } },
      ],
    };

    expect(removeEdgesAndNodes(connection)).toEqual([
      { id: 1 },
      { id: 2 },
      { id: 3 },
    ]);
  });
});
