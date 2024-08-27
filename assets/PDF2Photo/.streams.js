const fs = require("fs");
const { PDFDocument } = require("pdf-lib");
const { fromBuffer } = require("pdf2pic");
const { PassThrough } = require("stream");

const pdfPath = "./Spinal Cord Trauma 2024.pdf";

if (!fs.existsSync(pdfPath)) {
  console.error("PDF file not found:", pdfPath);
  process.exit(1);
}

const options = {
  saveFilename: "untitled",
  savePath: "./images/600Streams",
  format: "png", // PNG is a lossless format
  width: 3508, // A3 size width at 300 DPI
  height: 4961, // A3 size height at 300 DPI
  density: 600, // Very high DPI for sharpness
};

async function convertPdfToImages(pdfStream) {
  const passThrough = new PassThrough();
  const pdfDoc = await PDFDocument.load(await streamToBuffer(pdfStream));
  const numPages = pdfDoc.getPageCount();

  for (let i = 0; i < numPages; i++) {
    const page = pdfDoc.getPage(i);
    const pageBuffer = await pageToImage(page, options);
    fs.writeFileSync(
      `${options.savePath}/${options.saveFilename}_page_${i + 1}.png`,
      pageBuffer
    );
  }

  console.log("Images saved successfully.");
}

function pageToImage(page, options) {
  return new Promise((resolve, reject) => {
    const convert = fromBuffer(page, options);
    convert
      .bulk(-1)
      .then((resolve) => resolve(resolve))
      .catch((error) => reject(error));
  });
}

function streamToBuffer(stream) {
  return new Promise((resolve, reject) => {
    const chunks = [];
    stream.on("data", (chunk) => chunks.push(chunk));
    stream.on("end", () => resolve(Buffer.concat(chunks)));
    stream.on("error", reject);
  });
}

const pdfStream = fs.createReadStream(pdfPath);
convertPdfToImages(pdfStream).catch((err) => {
  console.error("An error occurred during conversion:", err);
});
