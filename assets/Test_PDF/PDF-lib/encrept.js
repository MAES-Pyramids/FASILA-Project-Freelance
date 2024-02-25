const fs = require("fs");
const qpdf = require("node-qpdf");

async function encryptAndUploadToS3(pdfPath) {
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
