const { PDFDocument, rgb, degrees } = require("pdf-lib");
const fs = require("fs");

async function addDiagonalWatermark(
  inputFilePath,
  outputFilePath,
  watermarkText
) {
  const pdfBytes = fs.readFileSync(inputFilePath);
  const pdfDoc = await PDFDocument.load(pdfBytes);

  const pages = pdfDoc.getPages();
  for (const page of pages) {
    const { width, height } = page.getSize();
    const watermark = watermarkText || "Watermark";

    const diagonalPosition = {
      x: width / 3,
      y: height / 3,
    };

    const spaceBetweenCharacters = 30;
    const semiTransparentColor = rgb(0.8, 0.8, 0.8);

    let currentX = diagonalPosition.x;
    let currentY = diagonalPosition.y;
    for (const char of watermark) {
      page.drawText(char, {
        x: currentX,
        y: currentY,
        size: 60,
        opacity: 0.6,
        color: semiTransparentColor,
        rotate: degrees(45),
        pivot: [currentX, currentY],
      });

      currentX += spaceBetweenCharacters;
      currentY += spaceBetweenCharacters;
    }
  }

  const modifiedPdfBytes = await pdfDoc.save();
  fs.writeFileSync(outputFilePath, modifiedPdfBytes);

  console.log("Diagonal Watermark added successfully!");
}

addDiagonalWatermark(
  "../source/Text_photos2.pdf",
  "../output/watermarked_pdf_lib3.pdf",
  "01007045993"
);
