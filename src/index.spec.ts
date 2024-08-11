import { isTag, spliteInTags } from "./index";

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

    '<input [value]="name" (input)="name = $event.target.value">',

    '<button (click)="guardarDatos()">',

    '<img src={imagenUrl} alt="description" />',
    '<input v-model="nombre"> ',
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

describe("spliteInTags", () => {
  it("should split a simple HTML string into tags and content", () => {
    const htmlString = "<div><p>Hello</p></div>";
    const expectedResult = ["<div>", "<p>", "Hello", "</p>", "</div>"];

    expect(spliteInTags(htmlString)).toEqual(expectedResult);
  });

  it("should handle self-closing tags", () => {
    const htmlString = '<div><img src="image.jpg" /></div>';
    const expectedResult = ["<div>", '<img src="image.jpg" />', "</div>"];

    expect(spliteInTags(htmlString)).toEqual(expectedResult);
  });

  it("should handle tags with attributes", () => {
    const htmlString =
      '<div class="container"><p id="my-paragraph">Content</p></div>';
    const expectedResult = [
      '<div class="container">',
      '<p id="my-paragraph">',
      "Content",
      "</p>",
      "</div>",
    ];

    expect(spliteInTags(htmlString)).toEqual(expectedResult);
  });

  it("should handle nested tags", () => {
    const htmlString =
      "<div><p>Hello <b>world</b>!</p><span> hello word2 </span></div>";
    const expectedResult = [
      "<div>",
      "<p>",
      "Hello ",
      "<b>",
      "world",
      "</b>",
      "!",
      "</p>",
      "<span>",
      " hello word2 ",
      "</span>",
      "</div>",
    ];

    expect(spliteInTags(htmlString)).toEqual(expectedResult);
  });

  it("should handler whitespace, linebreak and \\t around tags", () => {
    const htmlString = "  <div>  \n\t<p>Text</p>  </div>  ";
    const expectedResult = [
      "  ",
      "<div>",
      "  \n\t",
      "<p>",
      "Text",
      "</p>",
      "  ",
      "</div>",
      "  ",
    ];

    expect(spliteInTags(htmlString)).toEqual(expectedResult);
  });

  it("should handle empty tags", () => {
    const htmlString = "<div></div><br /><hr />";
    const expectedResult = ["<div>", "</div>", "<br />", "<hr />"];

    expect(spliteInTags(htmlString)).toEqual(expectedResult);
  });

  it("should handle tags with forward slashes in attributes", () => {
    const htmlString = '<img src="/images/logo.png" alt="Logo" />';
    const expectedResult = ['<img src="/images/logo.png" alt="Logo" />'];

    expect(spliteInTags(htmlString)).toEqual(expectedResult);
  });

  it("should handle CDATA sections", () => {
    const htmlString = "<div><![CDATA[This is CDATA content]]></div>";
    const expectedResult = [
      "<div>",
      "<![CDATA[This is CDATA content]]>",
      "</div>",
    ];

    expect(spliteInTags(htmlString)).toEqual(expectedResult);
  });

  it("should return an empty array for an empty string", () => {
    expect(spliteInTags("")).toEqual([]);
  });

  it("return the string for a string", () => {
    expect(spliteInTags("This is just plain text")).toEqual([
      "This is just plain text",
    ]);
  });

  it("should split angular tags", () => {
    const htmlString = '<button (click)="increment()"> Increment </button>';
    const expectedResult = [
      '<button (click)="increment()">',
      " Increment ",
      "</button>",
    ];

    expect(spliteInTags(htmlString)).toEqual(expectedResult);
  });
});
