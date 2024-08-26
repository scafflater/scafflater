import { stringEquals, stringNotEquals } from "./stringCompare.js";
import Handlebars from "handlebars";

test("String Equals", () => {
  expect(stringEquals("test string", "test string")).toBe(true);
  expect(stringEquals("test string", "teststring")).toBe(false);
});

test("String not Equals", () => {
  expect(stringNotEquals("test string", "test string")).toBe(false);
  expect(stringNotEquals("test string", "teststring")).toBe(true);
});

test("Handlebars call equal string", () => {
  Handlebars.registerHelper("stringEquals", stringEquals);
  expect(Handlebars.compile('{{stringEquals "prd" "prd" }}', {})({})).toBe(
    "true",
  );
});

test("Handlebars call not equal string", () => {
  Handlebars.registerHelper("stringNotEquals", stringNotEquals);
  expect(Handlebars.compile('{{stringNotEquals "prd" "prd" }}', {})({})).toBe(
    "false",
  );
});
