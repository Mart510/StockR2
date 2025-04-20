import { assert, assertEquals } from "@std/assert";

Deno.test("hello World", () => {
    assert(true);
});

Deno.test("function addTest()", () => {
    assertEquals(2 + 3, 5);
});