const { s3UploadModifiedPDF } = require("../services/digitalocean.service");
const { PDFDocument, rgb, degrees } = require("pdf-lib");
const generator = require("generate-password");
const sizeOf = require("image-size");
const qpdf = require("node-qpdf");
const uuid = require("uuid").v4;
const axios = require("axios");
const path = require("path");
const fs = require("fs");

const addDWatermarkText = (page, watermarkObject, watermarkOptions) => {
  const { spaceBetweenCharacters, opacity } = watermarkOptions;
  const { watermarkPhone } = watermarkObject;
  const { width, height } = page.getSize();
  const diagonalPosition = {
    x: width / 3,
    y: height / watermarkObject.waterMarkHI,
  };

  const semiTransparentColor = rgb(0.8, 0.8, 0.8);

  let PhoneCurrentX = diagonalPosition.x;
  let PhoneCurrentY = diagonalPosition.y;

  for (const char of watermarkPhone) {
    page.drawText(char, {
      x: PhoneCurrentX,
      y: PhoneCurrentY,
      size: 30,
      opacity,
      rotate: degrees(35),
      color: semiTransparentColor,
      pivot: [PhoneCurrentX, PhoneCurrentY],
    });
    PhoneCurrentX += spaceBetweenCharacters;
    PhoneCurrentY += spaceBetweenCharacters - 5;
  }
};

const addDWatermarkImage = (watermarkImage, image, currentPage) => {
  const dimensions = sizeOf(image);
  const { height: imageHeight, width: imageWidth } = dimensions;
  const aspectRatio = imageWidth / imageHeight;

  const { width, height } = currentPage.getSize();
  const watermarkWidth = parseInt(width / 3);
  const watermarkHeight = parseInt(watermarkWidth / aspectRatio);

  const watermarkOptions = {
    x: width / 3,
    // y: height / 2 - watermarkHeight / 2,
    y: 0,
    width: watermarkWidth,
    height: watermarkHeight,
  };

  currentPage.drawImage(watermarkImage, {
    x: watermarkOptions.x,
    y: watermarkOptions.y,
    width: watermarkOptions.width,
    height: watermarkOptions.height,
    opacity: 0.25,
  });
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

async function createZipWithPassword(images, zipPath, password) {
  return new Promise((resolve, reject) => {
    try {
      const output = fs.createWriteStream(zipPath);
      archiver.registerFormat("zip-encrypted", zip_encrypted_Plugin);
      const archive = archiver("zip-encrypted", {
        password,
        zlib: { level: 8 },
        encryptionMethod: "aes256",
      });

      output.on("close", () => resolve());
      output.on("error", (err) => reject(err));
      archive.on("error", (err) => reject(err));

      archive.pipe(output);

      images.forEach((imageBuffer, index) => {
        const imageStream = new PassThrough();
        imageStream.end(imageBuffer);
        archive.append(imageStream, { name: `page_${index + 1}.png` });
      });

      archive.finalize();
    } catch (error) {
      reject(error);
    }
  });
}

async function convertPdfToImages(pdfBuffer, zipPath, password) {
  const startTime = performance.now();

  try {
    return (pdfArray = await pdf2img.convert(pdfBuffer, {
      width: 1240,
      height: 1754,
    }));
  } catch (error) {
    console.error("Error converting PDF to images or creating zip file", error);
  } finally {
    console.log(`file created,Time taken: ${performance.now() - startTime} ms`);
  }
}

addWatermarkAndEmptyPages = async function (
  inputFileURL,
  watermarkPhone,
  facultyCardPath,
  waterMarkDetails,
  emptyPageDetails
) {
  const myMap = new Map([
    [1, 1.3],
    [2, 2.3],
    [3, 10],
  ]);

  const { addEmptyPages, addTwoEmptyPagesAtEnd, addEmptyPageAfter } =
    emptyPageDetails;

  const EPHeightP = 100;
  const EPWidthP = 100;

  // console.log("Start Downloading PDF File...");
  let response;
  try {
    response = await axios.get(inputFileURL, {
      responseType: "arraybuffer",
      timeout: 30000,
    });
  } catch (err) {
    if (axios.isCancel(err)) throw new Error("downloading (exceeded 30 Secs)");
    else throw new Error("Error getting file from URL");
  }
  // console.log("File Downloaded Successfully...");

  const pdfBytes = Buffer.from(response.data);
  const pdfDoc = await PDFDocument.load(pdfBytes);

  // console.log("Start Downloading Image...");
  let image;
  try {
    const imageResponse = await axios.get(facultyCardPath, {
      responseType: "arraybuffer",
    });
    image = Buffer.from(imageResponse.data);
  } catch (err) {
    throw new Error("Error getting Image from URL");
  }
  // console.log("Image File Downloaded Successfully...");
  const watermarkImage = await pdfDoc.embedPng(image);

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
      if (value == 10) addDWatermarkImage(watermarkImage, image, currentPage);
      else
        addDWatermarkText(
          currentPage,
          { waterMarkHI: value, watermarkPhone },
          waterMarkDetails
        );
    });
  }

  const PdfBytes = await pdfDoc.save();

  const password = generator.generate({
    length: 12,
    numbers: true,
    uppercase: true,
    lowercase: true,
    excludeSimilarCharacters: false,
  });

  const pdfArray = await convertPdfToImages(PdfBytes);

  await createZipWithPassword(pdfArray, "password-protected.zip", password);

  // console.log("Files got stored on Disk");

  try {
    const encryptedPdfBytes = fs.readFileSync(outputFilePath);

    // console.log("Start uploading to digital ocean");
    const { status, key, message } = await s3UploadModifiedPDF(
      encryptedPdfBytes
    );
    // console.log("File uploaded to digital ocean ..");

    if (status) return { status: "true", path: key, password };
    else throw new Error(`Error uploading file to DigitalOcean ${message}`);
  } catch (err) {
    throw new Error(`Error uploading file to DigitalOcean ${err.message}`);
  }
};

addWatermarkAndEmptyPages(
  "http://localhost:3000/Spinal%20Cord%20Trauma%202024.pdf",
  "01007045993",
  "http://localhost:3000/61d84667-d6b3-4ae6-b2bf-964a7625d7c5-photo_2024-02-08_11-39-23-removebg-preview.png",
  {
    spaceBetweenCharacters: 30,
    opacity: 0.5,
  },
  {
    addEmptyPages: true,
    addTwoEmptyPagesAtEnd: true,
    addEmptyPageAfter: 3,
  }
);
