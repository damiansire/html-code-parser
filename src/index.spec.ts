import { isTag, splitHtmlIntoElements } from "./index";

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

describe("splitHtmlIntoElements", () => {
  const testCases = [
    {
      description: "splits a simple HTML string into tags and content",
      htmlString: "<div><p>Hello</p></div>",
      expectedResult: ["<div>", "<p>", "Hello", "</p>", "</div>"],
    },
    {
      description: "handles self-closing tags",
      htmlString: '<div><img src="image.jpg" alt="An image" /></div>',
      expectedResult: [
        "<div>",
        '<img src="image.jpg" alt="An image" />',
        "</div>",
      ],
    },
    {
      description: "handles tags with attributes",
      htmlString:
        '<div class="container"><p id="my-paragraph">Content</p></div>',
      expectedResult: [
        '<div class="container">',
        '<p id="my-paragraph">',
        "Content",
        "</p>",
        "</div>",
      ],
    },
    {
      description: "handles nested tags",
      htmlString:
        "<div><p>Hello <b>world</b>!</p><span>Other text</span></div>",
      expectedResult: [
        "<div>",
        "<p>",
        "Hello ",
        "<b>",
        "world",
        "</b>",
        "!",
        "</p>",
        "<span>",
        "Other text",
        "</span>",
        "</div>",
      ],
    },
    {
      description: "handles whitespace, line breaks, and tabs around tags",
      htmlString: "  <div>  \n\t<p>Text</p>  </div>  ",
      expectedResult: [
        "  ",
        "<div>",
        "  \n\t",
        "<p>",
        "Text",
        "</p>",
        "  ",
        "</div>",
        "  ",
      ],
    },
    {
      description: "handles empty tags",
      htmlString: "<div></div>  <br />  <hr />",
      expectedResult: ["<div>", "</div>", "  ", "<br />", "  ", "<hr />"],
    },
    {
      description: "handles tags with forward slashes in attributes",
      htmlString: '<img src="/images/logo.png" alt="Logo" />',
      expectedResult: ['<img src="/images/logo.png" alt="Logo" />'],
    },
    {
      description: "handles CDATA sections",
      htmlString: "<div><![CDATA[This is CDATA content]]></div>",
      expectedResult: ["<div>", "<![CDATA[This is CDATA content]]>", "</div>"],
    },
    {
      description: "returns an empty array for an empty string",
      htmlString: "",
      expectedResult: [],
    },
    {
      description: "returns the original string for a string without tags",
      htmlString: "This is just plain text",
      expectedResult: ["This is just plain text"],
    },
    {
      description: "splits Angular tags with events",
      htmlString: '<button (click)="increment()"> Increment </button>',
      expectedResult: [
        '<button (click)="increment()">',
        " Increment ",
        "</button>",
      ],
    },
    {
      description: "handles multiple attributes in a tag",
      htmlString: '<a href="#" class="btn" id="my-link">Link</a>',
      expectedResult: ['<a href="#" class="btn" id="my-link">', "Link", "</a>"],
    },
    {
      description: "handles tags with single quotes in attributes",
      htmlString: '<div data-info=\'{"key": "value"}\'></div>',
      expectedResult: ['<div data-info=\'{"key": "value"}\'>', "</div>"],
    },
    {
      description: "handles HTML tags within attributes",
      htmlString: '<div title="Tooltip with <em>emphasis</em>"></div>',
      expectedResult: [
        '<div title="Tooltip with <em>emphasis</em>">',
        "</div>",
      ],
    },
  ];
  test.each(testCases)("$description", ({ htmlString, expectedResult }) => {
    expect(splitHtmlIntoElements(htmlString)).toEqual(expectedResult);
  });
});
