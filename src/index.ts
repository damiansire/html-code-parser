export function isTag(str: string): boolean {
  // Normalize the string by trimming and converting to lowercase
  str = str.trim().toLowerCase();

  // Check for valid start and end characters
  if (!str.startsWith("<") || (!str.endsWith(">") && !str.endsWith("/>"))) {
    return false;
  }

  // Enhanced Regex (Case-insensitive, Handles attributes, and spaces correctly, plus Angular events)
  const tagRegex =
    /^<\/?[a-z][\w-]*(\s+[\w-\[\]]*(?:(?:\(\s*\w+\s*\))?=\s*(?:".*?"|'.*?'|[^'">\s]+))?)*\s*\/?>$/;

  return tagRegex.test(str);
}

export function splitHtmlIntoElements(htmlString: string) {
  let allElements: string[] = [];
  let currentElement = "";
  let currentScopeOpenTag = 0;
  for (let i = 0; i < htmlString.length; i++) {
    let caracter = htmlString[i];
    if (caracter === "<") {
      currentScopeOpenTag++;
      if (currentScopeOpenTag === 1) {
        if (currentElement === "") {
          currentElement = "<";
        } else {
          allElements.push(currentElement);
          currentElement = "<";
        }
      } else if (currentScopeOpenTag > 1) {
        currentElement += "<";
      } else {
        currentElement += "<";
      }
    } else if (caracter === ">") {
      currentScopeOpenTag--;
      if (currentScopeOpenTag === 0) {
        currentElement += caracter;
        allElements.push(currentElement);
        currentElement = "";
      }
      if (currentScopeOpenTag < 0) {
        currentScopeOpenTag = 0;
      }
      if (currentScopeOpenTag > 0) {
        currentElement += caracter;
      }
    } else if (i === htmlString.length - 1) {
      currentElement += caracter;
      allElements.push(currentElement);
    } else {
      currentElement += caracter;
    }
  }

  return allElements;
}
