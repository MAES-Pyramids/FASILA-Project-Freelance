const { PDFDocument } = require("pdf-lib");
const fs = require("fs").promises;

async function insertEmptyPages(inputPath, outputPath, numEmptyPages) {
  const pdfDoc = await PDFDocument.load(await fs.readFile(inputPath));

  for (let i = 0; i < pdfDoc.getPageCount(); i += numEmptyPages + 1) {
    const existingPage = pdfDoc.getPage(i);
    const { width, height } = existingPage.getSize();

    const newPage = pdfDoc.insertPage(i);
    newPage.setSize(width, height);
  }

  await fs.writeFile(outputPath, await pdfDoc.save());
}

const inputFilePath = "../output/watermarked_pdf_lib.pdf";
const outputFilePath = "../output/watermarked_pdf_lib_Inserted.pdf";
const numberOfEmptyPages = 1;

insertEmptyPages(inputFilePath, outputFilePath, numberOfEmptyPages)
  .then(() => console.log("Empty pages inserted successfully"))
  .catch((error) => console.error("Error:", error));
