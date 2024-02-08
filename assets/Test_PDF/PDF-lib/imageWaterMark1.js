const { PDFDocument } = require("pdf-lib");
const sizeOf = require("image-size");
const fs = require("fs");

async function addImageWatermark(
  inputFilePath,
  outputFilePath,
  watermarkImagePath
) {
  // Read the PDF
  const pdfBytes = fs.readFileSync(inputFilePath);
  const pdfDoc = await PDFDocument.load(pdfBytes);
  let width, height;

  // Load the image for the watermark
  const watermarkImageBytes = fs.readFileSync(watermarkImagePath);

  const dimensions = sizeOf(watermarkImagePath);
  ({ height, width } = dimensions);
  const aspectRatio = width / height;

  // Embed the image as PDFImage
  const watermarkImage = await pdfDoc.embedJpg(watermarkImageBytes); // Use embedJpg for JPG images

  // Get the first page of the PDF
  const firstPage = pdfDoc.getPages()[0];
  ({ width, height } = firstPage.getSize());

  const watermarkWidth = parseInt(width / 2);
  const watermarkHeight = parseInt(watermarkWidth / aspectRatio);

  // Set the position and size of the watermark
  const watermarkOptions = {
    x: width / 4, // Set the x-coordinate of the watermark
    y: height / 2 - watermarkHeight / 2, // Set the y-coordinate of the watermark
    width: watermarkWidth, // Set the width of the watermark
    height: watermarkHeight, // Set the height of the watermark
  };

  // Set the alpha (transparency) value for the image
  const alpha = 0.2; // Adjust this value as needed

  // Draw the watermark on the first page with opacity
  firstPage.drawImage(watermarkImage, {
    x: watermarkOptions.x,
    y: watermarkOptions.y,
    width: watermarkOptions.width,
    height: watermarkOptions.height,
    opacity: alpha, // Set the alpha value here
  });

  // Save the modified PDF to a new file
  const modifiedPdfBytes = await pdfDoc.save();
  fs.writeFileSync(outputFilePath, modifiedPdfBytes);

  console.log("Watermark added successfully!");
}

// Example usage
const inputFilePath = "../source/test.pdf";
const outputFilePath = "../output/watermarked_pdf_lib.pdf";
const watermarkImagePath = "./Mohamed Abo El-Seoud ID.jpg";

addImageWatermark(inputFilePath, outputFilePath, watermarkImagePath);
