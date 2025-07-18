export default function checkRequiredFields(fields) {
  const requiredFields = [
    "case id",
    "address",
    "signature",
    "delegation message",
    "qr code",
  ];

  const lowerCaseFields = fields.map((field) => field.toLowerCase());

  for (let field of requiredFields) {
    if (!lowerCaseFields.includes(field)) {
      return false;
    }
  }

  return true;
}
