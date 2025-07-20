export function getLanguage(filename: string) {
  const ext = filename.split(".").pop();
  switch (ext) {
    case "js":
    case "cjs":
    case "mjs":
    case "jsx":
      return "javascript";
    case "ts":
    case "tsx":
      return "typescript";
    case "json":
      return "json";
    case "md":
      return "markdown";
    case "py":
      return "python";
    case "html":
      return "html";
    case "css":
      return "css";
    default:
      return "text";
  }
}
