const { PDFDocument, rgb } = require("pdf-lib");
const fs = require("fs");

async function addWatermark(inputFilePath, outputFilePath, watermarkText) {
  // Read the existing PDF
  const pdfBytes = fs.readFileSync(inputFilePath);

  // Load the PDF
  const pdfDoc = await PDFDocument.load(pdfBytes);

  // Add a watermark to each page
  const pages = pdfDoc.getPages();
  for (const page of pages) {
    const { width, height } = page.getSize();

    // Create a watermark text
    const watermark = watermarkText || "Watermark";

    // Add the watermark to the page
    page.drawText(watermark, {
      x: width / 3,
      y: height / 2,
      size: 50,
      color: rgb(0.7, 0.7, 0.7), // Adjust the color as needed
    });
  }

  // Save the modified PDF to a new file
  const modifiedPdfBytes = await pdfDoc.save();
  fs.writeFileSync(outputFilePath, modifiedPdfBytes);

  console.log("Watermark added successfully!");
}

// Replace 'input.pdf' and 'output.pdf' with your input and output file paths
// Replace 'Watermark Text' with the desired watermark text
addWatermark(
  "../source/Text_photos.pdf",
  "../output/Text_photos_watermarked_pdf_lib.pdf",
  "01007045993"
);
