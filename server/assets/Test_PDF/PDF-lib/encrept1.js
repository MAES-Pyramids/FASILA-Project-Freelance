const fs = require("fs");
const { PDFDocument } = require("pdf-lib");
const PDFKit = require("pdfkit");

async function setPassword() {
  // Load the existing PDF file using pdf-lib
  const existingPdfBytes = fs.readFileSync("../source/test.pdf");
  const password = "12345678HHaal021";
  const outputFileName = "../output/encrypted.pdf";

  // Create a PDFDocument instance from pdf-lib
  const pdfDoc = await PDFDocument.load(existingPdfBytes);

  // Create a new PDF using pdfkit
  const pdfKitDoc = new PDFKit();

  // Embed the existing PDF as a page in the new PDF
  pdfKitDoc.addPage().pdf(existingPdfBytes);

  // Set the password for the new PDF (user password)
  pdfDoc.setUserPassword(password);
  pdfDoc.setOwnerPassword(password);

  // Save the output PDF to a file
  const modifiedPdfBytes = await pdfDoc.save();
  fs.writeFileSync(outputFileName, modifiedPdfBytes);

  console.log(`PDF with password protection saved as ${outputFileName}`);
}

setPassword();
