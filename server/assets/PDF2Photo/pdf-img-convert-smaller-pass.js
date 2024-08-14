const fs = require("fs");
const archiver = require("archiver");
const pdf2img = require("pdf-img-convert");
const { PassThrough } = require("stream");
const zip_encrypted_Plugin = require("archiver-zip-encrypted");

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

async function convertPdfToImages(pdfPath, zipPath, password) {
  const startTime = performance.now();

  try {
    const pdfBuffer = fs.readFileSync(pdfPath);
    const pdfArray = await pdf2img.convert(pdfBuffer, {
      width: 1240,
      height: 1754,
    });

    await createZipWithPassword(pdfArray, zipPath, password);
  } catch (error) {
    console.error("Error converting PDF to images or creating zip file", error);
  } finally {
    console.log(`file created,Time taken: ${performance.now() - startTime} ms`);
  }
}

convertPdfToImages(
  "./uploaded_test_resources/Spinal Cord Trauma 2024.pdf",
  "password-protected.zip",
  "your-password-here"
);
