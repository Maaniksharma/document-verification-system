import mammoth from "mammoth";

export default async function (path) {
  const fields = [];
  const { value: text } = await mammoth.extractRawText({
    path,
  });
  const fieldPattern = /\{([^}]+)\}/g;
  let match = fieldPattern.exec(text);
  while (match !== null) {
    const fieldName = match[1].trim();
    if (fieldName && !fields.includes(fieldName)) {
      fields.push(fieldName);
    }
    match = fieldPattern.exec(text);
  }
  return fields;
}
