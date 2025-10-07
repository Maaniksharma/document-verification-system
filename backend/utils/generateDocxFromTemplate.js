import fs from "fs/promises";
import PizZip from "pizzip";
import Docxtemplater from "docxtemplater";

export async function generateDocxFromTemplate(templatePath, data) {
  const content = await fs.readFile(templatePath, "binary");
  const zip = new PizZip(content);
  const doc = new Docxtemplater(zip, {
    paragraphLoop: true,
    linebreaks: true,
    nullGetter: function (part) {
      return "";
    },
  });

  doc.render(data);

  return doc.toBuffer();
}
