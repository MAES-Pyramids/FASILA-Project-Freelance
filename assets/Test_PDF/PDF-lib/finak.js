const { PDFDocument, rgb, degrees } = require("pdf-lib");
const fs = require("fs/promises");

async function addWatermarkAndEmptyPages(
  inputFilePath,
  outputFilePath,
  watermarkText,
  addEmptyPages = false,
  numEmptyPages = 1,
  emptyPageHeightPercent = 100,
  emptyPageWidthPercent = 50,
  lineSpacing = 30
) {
  const pdfBytes = await fs.readFile(inputFilePath);
  const pdfDoc = await PDFDocument.load(pdfBytes);

  const addDiagonalWatermarkToPage = (page) => {
    const { width, height } = page.getSize();
    const watermark = watermarkText || "Watermark";

    const diagonalPosition = {
      x: width / 4,
      y: height / 3,
    };

    const spaceBetweenCharacters = 25;
    const semiTransparentColor = rgb(0.8, 0.8, 0.8);

    let currentX = diagonalPosition.x;
    let currentY = diagonalPosition.y;
    for (const char of watermark) {
      page.drawText(char, {
        x: currentX,
        y: currentY,
        size: 50,
        opacity: 0.4,
        rotate: degrees(45),
        color: semiTransparentColor,
        pivot: [currentX, currentY],
      });

      currentX += spaceBetweenCharacters;
      currentY += spaceBetweenCharacters;
    }
  };

  for (let i = 0; i < pdfDoc.getPageCount(); i++) {
    const currentPage = pdfDoc.getPage(i);
    const { width, height } = currentPage.getSize();
    const [newWidth, newHeight] = [
      (width * emptyPageWidthPercent) / 100,
      (height * emptyPageHeightPercent) / 100,
    ];

    if (addEmptyPages && i < pdfDoc.getPageCount()) {
      // Insert empty pages after each page
      for (let j = 0; j < numEmptyPages; j++) {
        const newPage = pdfDoc.insertPage(i + 1 + j);
        newPage.setSize(newWidth, newHeight);

        // Draw lines on the empty page
        const linesPerPage = Math.floor(newHeight / lineSpacing);

        for (let k = 0; k < linesPerPage; k++) {
          newPage.drawLine({
            start: { x: 10, y: k * lineSpacing },
            end: { x: newWidth - 10, y: k * lineSpacing },
            thickness: 1,
            color: rgb(0.8, 0.8, 0.8),
          });
        }
      }
      i += numEmptyPages;
    }

    addDiagonalWatermarkToPage(currentPage);
  }

  const modifiedPdfBytes = await pdfDoc.save();
  await fs.writeFile(outputFilePath, modifiedPdfBytes);

  console.log("Watermark and empty pages added successfully!");
}

// Example usage:
addWatermarkAndEmptyPages(
  "../source/test.pdf",
  "../output/test.pdf",
  "01007045993",
  true // Enable adding empty pages
);
