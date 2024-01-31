const { PDFDocument, rgb, degrees } = require("pdf-lib");
const fs = require("fs/promises");
const axios = require("axios");

const addDWatermark = (page, watermarkObject) => {
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

const addEmptyPage = (pdfDoc, index, newWidth, newHeight) => {
  const lineSpacing = 30;
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

exports.addWatermarkAndEmptyPages = async function (
  inputFileURL,
  outputFilePath,
  watermarkPhone,
  addEmptyPages = false,
  emptyPageOptions
) {
  const { addTwoEmptyPagesAtEnd, addEmptyPageAfter } = emptyPageOptions;
  const EPHeightP = 100;
  const EPWidthP = 100;

  let response;
  try {
    response = await axios.get(inputFileURL, { responseType: "arraybuffer" });
  } catch (err) {
    throw new Error("Error getting file from URL");
  }

  const myMap = new Map([
    [1, 1.3],
    [2, 2.3],
    [3, 10],
  ]);

  const pdfBytes = Buffer.from(response.data);
  const pdfDoc = await PDFDocument.load(pdfBytes);

  let addedPagesNo = 0;
  for (let i = 0; i < pdfDoc.getPageCount(); i++) {
    const currentPage = pdfDoc.getPage(i);
    const { width, height } = currentPage.getSize();

    const [newWidth, newHeight] = [
      (width * EPWidthP) / 100,
      (height * EPHeightP) / 100,
    ];

    if (addEmptyPages) {
      if (addTwoEmptyPagesAtEnd && i === pdfDoc.getPageCount() - 1) {
        for (let j = 0; j < 2; j++) {
          addEmptyPage(pdfDoc, i + 1 + j, newWidth, newHeight);
        }
        i += 2;
      }

      if (
        !addTwoEmptyPagesAtEnd &&
        ((i + 1 - addedPagesNo) % addEmptyPageAfter == 0 ||
          i + 1 == pdfDoc.getPageCount())
      ) {
        addEmptyPage(pdfDoc, i + 1, newWidth, newHeight);
        addedPagesNo++;
        i++;
      }
    }

    myMap.forEach((value) => {
      addDWatermark(currentPage, {
        waterMarkHI: value,
        watermarkPhone,
      });
    });
  }

  const modifiedPdfBytes = await pdfDoc.save();
  await fs.writeFile(outputFilePath, modifiedPdfBytes);

  return {
    status: "true",
    message: "Watermark and empty pages added successfully!",
  };
};
