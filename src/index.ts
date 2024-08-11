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

export function spliteInTags(htmlString: string) {
  const regex = /(<[^>]+>)/g;

  const result = htmlString.split(regex).filter(Boolean);

  return result;
}
