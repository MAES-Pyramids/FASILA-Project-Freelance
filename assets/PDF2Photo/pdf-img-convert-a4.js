const fs = require("fs");
const path = require("path");
const pdf2img = require("pdf-img-convert");

async function convertPdfToImages(pdfPath, outputDir) {
  if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir);

  const startTime = performance.now(); // Start timing

  try {
    const pdfBuffer = fs.readFileSync(pdfPath);

    // Convert PDF to images
    const pdfArray = await pdf2img.convert(pdfBuffer, {
      width: 2480,
      height: 3508,
    });

    // Save images to the output directory
    for (let i = 0; i < pdfArray.length; i++) {
      const imagePath = path.join(outputDir, `page_${i + 1}.png`);
      fs.writeFileSync(imagePath, pdfArray[i]);
    }

    console.log("PDF converted to images successfully.");
  } catch (error) {
    console.error("Error converting PDF to images", error);
  } finally {
    const endTime = performance.now(); // End timing
    const timeTaken = endTime - startTime; // Calculate time taken
    console.log(`Time taken: ${timeTaken} milliseconds`); // Print time taken
  }
}

convertPdfToImages(
  "./Spinal Cord Trauma 2024.pdf",
  "pdf-img-convert-images/A4"
);
