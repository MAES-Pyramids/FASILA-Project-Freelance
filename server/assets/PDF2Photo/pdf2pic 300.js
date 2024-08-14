const fs = require("fs");
const { fromBuffer } = require("pdf2pic");

const pdfPath = "./uploaded_test_resources/Spinal Cord Trauma 2024.pdf";

if (!fs.existsSync(pdfPath)) {
  console.error("PDF file not found:", pdfPath);
  process.exit(1);
}

const pdfBuffer = fs.readFileSync(pdfPath);

const options = {
  saveFilename: "untitled",
  savePath: "./pdf2pic images/300Native",
  format: "png",
  width: 1240, // A4 size width at 300 DPI
  height: 1754, // A4 size height at 300 DPI
  density: 400, // 300 DPI for A4 is usually sufficient
};

const convert = fromBuffer(pdfBuffer, options);

convert
  .bulk(-1) // Process all pages; you can specify a range if needed
  .then((resolve) => {
    console.log("Images saved successfully.");
  })
  .catch((error) => {
    console.error("An error occurred during conversion:", error);
  });
