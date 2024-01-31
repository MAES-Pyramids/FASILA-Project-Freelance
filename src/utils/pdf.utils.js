const { PDFDocument, rgb, degrees } = require("pdf-lib");
const fs = require("fs/promises");
const axios = require("axios");
const Fontkit = require("fontkit");
// const {@font-indopak} = require("arabic-fonts/src/css/arabic-fonts.css");

const addWatermarkAndEmptyPages = async function (
  inputFileURL,
  outputFilePath,
  watermarkObject,
  addEmptyPages = false
) {
  const EPHeightPercent = 100;
  const EPWidthPercent = 50;
  const numEmptyPages = 1;
  const lineSpacing = 30;
  let response;

  try {
    response = await axios.get(inputFileURL, {
      responseType: "arraybuffer",
    });
  } catch (err) {
    console.log(err);
  }

  const myMap = new Map([
    [1, 1.3],
    [2, 2.3],
    [3, 10],
  ]);

  const pdfBytes = Buffer.from(response.data);
  const pdfDoc = await PDFDocument.load(pdfBytes);
  pdfDoc.registerFontkit(Fontkit);

  const addDiagonalWatermarkToPage = (page, waterMarkHI) => {
    const { width, height } = page.getSize();
    const { watermarkPhone, watermarkName } = watermarkObject;
    const diagonalPosition = {
      x: width / 3,
      y: height / waterMarkHI,
    };

    const spaceBetweenCharacters = 15;
    const semiTransparentColor = rgb(0.8, 0.8, 0.8);

    let PhoneCurrentX = diagonalPosition.x;
    let PhoneCurrentY = diagonalPosition.y;
    for (const char of watermarkPhone) {
      page.drawText(char, {
        x: PhoneCurrentX,
        y: PhoneCurrentY,
        size: 30,
        opacity: 0.4,
        rotate: degrees(35),
        color: semiTransparentColor,
        pivot: [PhoneCurrentX, PhoneCurrentY],
      });
      PhoneCurrentX += spaceBetweenCharacters;
      PhoneCurrentY += spaceBetweenCharacters - 5;
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
    myMap.forEach((value, key) => {
      addDiagonalWatermarkToPage(currentPage, value);
    });
  }

  const modifiedPdfBytes = await pdfDoc.save();
  await fs.writeFile(outputFilePath, modifiedPdfBytes);
  console.log("Watermark and empty pages added successfully!");
};

addWatermarkAndEmptyPages(
  "https://fasila.onrender.com/pdfs/test_1.1.pdf",
  `${__dirname}/../../public/pdfs/test_1.1_modified.pdf`,
  {
    watermarkPhone: "01007045993",
    watermarkName: "مرحبا بك في",
  }
);

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

// const fontBytes = await fs.readFile(`${__dirname}/../../fonts/`);
// const arabicFont = await pdfDoc.embedFont(fontBytes);
// let NameCurrentX = diagonalPosition.x + 10;
// let NameCurrentY = diagonalPosition.y - 28;
// for (const char of watermarkName) {
//   page.drawText(char, {
//     x: NameCurrentX,
//     y: NameCurrentY,
//     size: 30,
//     opacity: 0.4,
//     rotate: degrees(35),
//     color: semiTransparentColor,
//     font: arabicFont,
//     pivot: [NameCurrentX, NameCurrentY],
//   });
//   NameCurrentX += spaceBetweenCharacters;
//   NameCurrentY += spaceBetweenCharacters;
// }
