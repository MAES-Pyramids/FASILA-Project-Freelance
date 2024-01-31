const { PDFDocument, rgb, degrees } = require("pdf-lib");
const fs = require("fs/promises");
const axios = require("axios");
const Fontkit = require("fontkit");

const addDiagonalWatermarkToPage = (page, watermarkObject) => {
  const { width, height } = page.getSize();
  const { watermarkPhone } = watermarkObject;
  const diagonalPosition = {
    x: width / 3,
    y: height / watermarkObject.waterMarkHI,
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

const addEmptyPageWithLines = (
  pdfDoc,
  index,
  newWidth,
  newHeight,
  lineSpacing
) => {
  const newPage = pdfDoc.insertPage(index);
  newPage.setSize(newWidth, newHeight);

  const linesPerPage = Math.floor(newHeight / lineSpacing);

  for (let k = 0; k < linesPerPage; k++) {
    newPage.drawLine({
      start: { x: 10, y: k * lineSpacing },
      end: { x: newWidth - 10, y: k * lineSpacing },
      thickness: 1,
      color: rgb(0.8, 0.8, 0.8),
    });
  }
};

const addWatermarkAndEmptyPages = async function (
  inputFileURL,
  outputFilePath,
  watermarkObject,
  addEmptyPages = false,
  emptyPageOptions
) {
  const { addTwoEmptyPagesAtEnd, addEmptyPageAfter } = emptyPageOptions;
  const EPHeightPercent = 100;
  const EPWidthPercent = 100;
  const lineSpacing = 30;

  let response;

  try {
    response = await axios.get(inputFileURL, {
      responseType: "arraybuffer",
    });
  } catch (err) {
    console.log(err);
    return { status: "false", message: "Error in fetching pdf file" };
  }

  const myMap = new Map([
    [1, 1.3],
    [2, 2.3],
    [3, 10],
  ]);

  const pdfBytes = Buffer.from(response.data);
  const pdfDoc = await PDFDocument.load(pdfBytes);

  for (let i = 0; i < pdfDoc.getPageCount(); i++) {
    const currentPage = pdfDoc.getPage(i);
    const { width, height } = currentPage.getSize();
    const [newWidth, newHeight] = [
      (width * EPWidthPercent) / 100,
      (height * EPHeightPercent) / 100,
    ];

    if (addEmptyPages) {
      if (addTwoEmptyPagesAtEnd && i === pdfDoc.getPageCount() - 1) {
        for (let j = 0; j < 2; j++) {
          addEmptyPageWithLines(
            pdfDoc,
            i + 1 + j,
            newWidth,
            newHeight,
            lineSpacing
          );
        }
        i += 2;
      } else if (i % addEmptyPageAfter === addEmptyPageAfter - 1) {
        addEmptyPageWithLines(pdfDoc, i + 1, newWidth, newHeight, lineSpacing);
        i++;
      }
    }

    myMap.forEach((value, key) => {
      addDiagonalWatermarkToPage(currentPage, {
        waterMarkHI: value,
        ...watermarkObject,
      });
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
  },
  true,
  {
    addTwoEmptyPagesAtEnd: true,
    addEmptyPageAfter: 2,
  }
);

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
