export default function (fields, validFields) {
  const lowercaseFields = validFields.map((field) => field.toLowerCase());
  for (let field of fields) {
    if (!lowercaseFields.includes(field.toLowerCase())) {
      return false;
    }
  }
  return true;
}
