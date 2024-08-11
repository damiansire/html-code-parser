import { isTag } from "./index";

describe("isTag", () => {
  const validTags = [
    "<h1>",
    "</h1>",
    "<div>",
    "<span>",
    "</span>",
    "<img />",
    "<input>",
    "<my-custom-element>",
    "<my-element-with-dash>",
    "<div >",
    "</div  >",
  ];
  const invalidTagCases = [
    "<1h1>",
    "< h1>",
    "<>",
    "<div",
    "div>",
    "</div",
    "<di$v>",
    "</di$v>",
  ];

  const tagsWithAttributes = [
    '<div id="myDiv">',

    '<img src="image.jpg" alt="Image">',

    '<custom-element data-info="value">',

    '<button class="btn btn-primary" disabled>',

    '<button (click)="increment()">',
  ];

  const caseInsensitiveTags = ["<DIV>", "</DIV>"];

  describe("should identify valid HTML tags", () => {
    test.each(validTags)("should return true for tag: %s", (tag) => {
      expect(isTag(tag)).toBeTruthy();
    });
  });

  describe("should identify invalid HTML tags", () => {
    test.each(invalidTagCases)("should return false for tag: %s", (tag) => {
      expect(isTag(tag)).toBeFalsy();
    });
  });

  describe("should handle tags with attributes", () => {
    test.each(tagsWithAttributes)("should return true for tag: %s", (tag) => {
      expect(isTag(tag)).toBeTruthy();
    });
  });

  describe("should be case-insensitive", () => {
    test.each(caseInsensitiveTags)("should return true for tag: %s", (tag) => {
      expect(isTag(tag)).toBeTruthy();
    });
  });

  it("should handle empty strings", () => {
    expect(isTag("")).toBeFalsy();
  });
});
