const fs = require("fs");
const qpdf = require("node-qpdf");

const { PDFDocument } = require("pdf-lib");

async function encryptAndUploadToS3(pdfPath) {
  const pdfBytes = fs.readFileSync(pdfPath);
  const pdfDoc = await PDFDocument.load(pdfBytes);
  const PdfBytes = await pdfDoc.save();
  fs.writeFileSync("../output/test.pdf", PdfBytes);

  const options = {
    keyLength: 256,
    password: "12345678HHaal021",
    outputFile: "../output/encrypted.pdf",
    restrictions: {
      print: "low",
    },
  };

  await qpdf.encrypt(pdfPath, options);
}

const pdfPath = "../source/test.pdf";

encryptAndUploadToS3(pdfPath)
  .then((encryptedPdfBytes) => {
    console.log("Encrypted PDF bytes");
  })
  .catch((error) => {
    console.error("Error:", error);
  });
