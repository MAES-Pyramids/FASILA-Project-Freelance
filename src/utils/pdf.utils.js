const { PDFDocument, rgb, degrees } = require("pdf-lib");
const fs = require("fs/promises");
const axios = require("axios");

const addWatermarkAndEmptyPages = async function (
  inputFileURL,
  outputFilePath,
  watermarkText,
  addEmptyPages = false
) {
  const numEmptyPages = 1;
  const lineSpacing = 30;
  const EPHeightPercent = 100;
  const EPWidthPercent = 50;
  let response;

  try {
    const response = await axios.get(inputFileURL, {
      responseType: "arraybuffer",
    });
  } catch (err) {
    console.log(err);
  }

  // const pdfBytes = await fs.readFile(inputFilePath);
  const pdfBytes = Buffer.from(response.data);
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
      (width * EPWidthPercent) / 100,
      (height * EPHeightPercent) / 100,
    ];

    // insert Empty Pages

    addDiagonalWatermarkToPage(currentPage);
  }

  const modifiedPdfBytes = await pdfDoc.save();
  await fs.writeFile(outputFilePath, modifiedPdfBytes);
  console.log("Watermark and empty pages added successfully!");
};

// addWatermarkAndEmptyPages(
//   "http://localhost:3000/pdfs/test_1.1.pdf",
//   "../../public/pdfs/test_1.1_modified.pdf",
//   "01007045993"
// );

// if (addEmptyPages && i < pdfDoc.getPageCount()) {
//   // Insert empty pages after each page
//   for (let j = 0; j < numEmptyPages; j++) {
//     const newPage = pdfDoc.insertPage(i + 1 + j);
//     newPage.setSize(newWidth, newHeight);

//     // Draw lines on the empty page
//     const linesPerPage = Math.floor(newHeight / lineSpacing);

//     for (let k = 0; k < linesPerPage; k++) {
//       newPage.drawLine({
//         start: { x: 10, y: k * lineSpacing },
//         end: { x: newWidth - 10, y: k * lineSpacing },
//         thickness: 1,
//         color: rgb(0.8, 0.8, 0.8),
//       });
//     }
//   }
//   i += numEmptyPages;
// }
