const { PDFDocument, rgb, degrees } = require("pdf-lib");
const generator = require("generate-password");
const pdf2img = require("pdf-img-convert");
const sizeOf = require("image-size");
const axios = require("axios");
const fs = require("fs");
const archiver = require("archiver");
const { PassThrough } = require("stream");
const zip_encrypted_Plugin = require("archiver-zip-encrypted");
const { fromBuffer } = require("pdf2pic");
const { pdfToPng } = require("pdf-to-png-converter");
const fontkit = require("fontkit");

const addWatermarkText = (
  page,
  waterMarkHI,
  watermarkPhone,
  textWatermarkOptions,
  font
) => {
  const { spaceBetweenCharacters, opacity } = textWatermarkOptions;
  const { width, height } = page.getSize();
  const startX = width / 3;
  const startY = height / waterMarkHI;

  let x = startX;
  let y = startY;

  const color = rgb(0.8, 0.8, 0.8);

  for (const char of watermarkPhone) {
    page.drawText(char, {
      x,
      y,
      size: 30,
      opacity,
      font,
      rotate: degrees(35),
      color,
      pivot: [x, y],
    });
    x += spaceBetweenCharacters;
    y += spaceBetweenCharacters - 5;
  }
};

const addWatermarkImage = (watermarkImage, image, page) => {
  const { width: pageWidth, height: pageHeight } = page.getSize();
  const { width: imageWidth, height: imageHeight } = sizeOf(image);
  const aspectRatio = imageWidth / imageHeight;

  const watermarkWidth = pageWidth / 3;
  const watermarkHeight = watermarkWidth / aspectRatio;

  page.drawImage(watermarkImage, {
    x: pageWidth / 3,
    y: 0,
    width: watermarkWidth,
    height: watermarkHeight,
    opacity: 0.25,
  });
};

const addEmptyPage = (pdfDoc, index, width, height) => {
  const page = pdfDoc.insertPage(index);
  page.setSize(width, height);

  const lineSpacing = 30;
  const linesPerPage = Math.floor(height / lineSpacing);

  for (let i = 0; i < linesPerPage; i++) {
    page.drawLine({
      start: { x: 10, y: i * lineSpacing },
      end: { x: width - 10, y: i * lineSpacing },
      thickness: 1,
      color: rgb(0.8, 0.8, 0.8),
    });
  }
};

const downloadFile = async (url, responseType = "arraybuffer") => {
  try {
    const response = await axios.get(url, { responseType, timeout: 30000 });
    return response.data;
  } catch (error) {
    throw new Error(`Error downloading file from URL: ${error.message}`);
  }
};

const createPasswordProtectedZip = async (images, zipPath, password) => {
  return new Promise((resolve, reject) => {
    try {
      const output = fs.createWriteStream(zipPath);
      archiver.registerFormat("zip-encrypted", zip_encrypted_Plugin);
      const archive = archiver("zip-encrypted", {
        password,
        zlib: { level: 8 },
        encryptionMethod: "aes256",
      });

      output.on("close", resolve);
      output.on("error", reject);
      archive.on("error", reject);

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
};

// const convertPdfToImages = async (pdfBuffer) => {
//   try {
//     return (pngPages = await pdfToPng(pdfBuffer, {
//       disableFontFace: true, // Ensures consistent text rendering
//       useSystemFonts: true, // Falls back to system fonts if embedded fonts fail
//       viewportScale: 2.0, // The desired scale of PNG viewport. Default value is 1.0.
//     }));
//   } catch (error) {
//     throw new Error(`Error converting PDF to images: ${error.message}`);
//   }
// };

const convertPdfToImages = async (pdfBuffer) => {
  try {
    return await pdf2img.convert(pdfBuffer, { width: 1240, height: 1754 });
  } catch (error) {
    throw new Error(`Error converting PDF to images: ${error.message}`);
  }
};

const addWatermarkAndEmptyPages = async (
  inputFileURL,
  watermarkPhone,
  facultyCardPath,
  watermarkOptions,
  emptyPageOptions
) => {
  const startTime = performance.now();

  try {
    const widthPercentage = 100;
    const heightPercentage = 100;
    const myMap = new Map([
      [1, 1.3],
      [2, 2.3],
      [3, 10],
    ]);

    console.log("Start Downloading PDF File...");
    const pdfBuffer = await downloadFile(inputFileURL);
    console.log("File Downloaded Successfully...");
    const pdfDoc = await PDFDocument.load(pdfBuffer);

    console.log("Start Downloading Image...");
    const imageBuffer = await downloadFile(facultyCardPath);
    console.log("Image File Downloaded Successfully...");
    const watermarkImage = await pdfDoc.embedPng(imageBuffer);

    pdfDoc.registerFontkit(fontkit);
    const fontBytes = fs.readFileSync(
      "./Open_Sans/OpenSans-VariableFont_wdth,wght.ttf"
    );
    const customFont = await pdfDoc.embedFont(fontBytes);

    let addedPages = 0;
    const pageCount = pdfDoc.getPageCount();

    for (let i = 0; i < pageCount; i++) {
      const page = pdfDoc.getPage(i);
      const { width, height } = page.getSize();
      const newWidth = (width * widthPercentage) / 100;
      const newHeight = (height * heightPercentage) / 100;

      if (emptyPageOptions.addEmptyPages) {
        if (emptyPageOptions.addTwoEmptyPagesAtEnd && i === pageCount - 1) {
          for (let j = 0; j < 2; j++) {
            addEmptyPage(pdfDoc, i + 1 + j, newWidth, newHeight);
          }
          i += 2;
        } else if (
          (i + 1 - addedPages) % emptyPageOptions.addEmptyPageAfter === 0 ||
          i + 1 === pageCount
        ) {
          addEmptyPage(pdfDoc, i + 1, newWidth, newHeight);
          addedPages++;
          i++;
        }
      }

      myMap.forEach((waterMarkHI) => {
        if (waterMarkHI == 10)
          addWatermarkImage(watermarkImage, imageBuffer, page);
        else
          addWatermarkText(
            page,
            waterMarkHI,
            watermarkPhone,
            watermarkOptions,
            customFont
          );
      });
    }

    const pdfBytes = await pdfDoc.save();

    const password = generator.generate({
      length: 12,
      numbers: true,
      uppercase: true,
    });

    console.log(
      `${performance.now() - startTime} passed, Start Converting pdf to imgs.`
    );
    const pdfImages = await convertPdfToImages(pdfBytes);
    console.log(
      `${performance.now() - startTime} passed, pdf converted to imgs.`
    );

    console.log(`Start Creating password protected zip  password: ${password}`);
    await createPasswordProtectedZip(
      pdfImages,
      "password-protected.zip",
      password
    );
    console.log(
      `password protected zip created successfully  password: ${password}`
    );

    // const encryptedPdfBytes = fs.readFileSync(outputFilePath);
    // const uploadResult = await s3UploadModifiedPDF(encryptedPdfBytes);

    // if (uploadResult.status) {
    //   return { status: "true", path: uploadResult.key, password };
    // } else {
    //   throw new Error(
    //     `Error uploading file to DigitalOcean: ${uploadResult.message}`
    //   );
    // }
  } catch (error) {
    console.error(`Failed to process PDF: ${error.message}`);
    throw error;
  } finally {
    console.log(`file created,Time taken: ${performance.now() - startTime} ms`);
  }
};

// Example usage
addWatermarkAndEmptyPages(
  "http://localhost:3000/Spinal%20Cord%20Trauma%202024.pdf",
  "01007045993",
  "http://localhost:3000/61d84667-d6b3-4ae6-b2bf-964a7625d7c5-photo_2024-02-08_11-39-23-removebg-preview.png",
  { spaceBetweenCharacters: 16, opacity: 1 },
  {
    addEmptyPages: true,
    addTwoEmptyPagesAtEnd: true,
    addEmptyPageAfter: 3,
  }
);
