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

  const watermarkWidth = parseInt(width / 3);
  const watermarkHeight = parseInt(watermarkWidth / aspectRatio);

  const alpha = 0.4; // Adjust this value as needed

  // Set the position and size of the watermark
  const watermarkOption1 = {
    x: width - watermarkWidth,
    y: height - watermarkHeight,
    width: watermarkWidth,
    height: watermarkHeight,
  };

  const watermarkOption2 = {
    x: width - watermarkWidth,
    y: height / 2 - watermarkHeight / 2,
    width: watermarkWidth,
    height: watermarkHeight,
  };

  const watermarkOption3 = {
    x: width - watermarkWidth,
    y: 0,
    width: watermarkWidth,
    height: watermarkHeight,
  };

  firstPage.drawImage(watermarkImage, {
    x: watermarkOption1.x,
    y: watermarkOption1.y,
    width: watermarkOption1.width,
    height: watermarkOption1.height,
    opacity: alpha,
  });

  firstPage.drawImage(watermarkImage, {
    x: watermarkOption2.x,
    y: watermarkOption2.y,
    width: watermarkOption2.width,
    height: watermarkOption2.height,
    opacity: alpha,
  });

  firstPage.drawImage(watermarkImage, {
    x: watermarkOption3.x,
    y: watermarkOption3.y,
    width: watermarkOption3.width,
    height: watermarkOption3.height,
    opacity: alpha,
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
