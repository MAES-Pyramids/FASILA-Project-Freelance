const fs = require("fs").promises;
const path = require("path");

async function convertPdfToImages(pdfPath, outputDir) {
  const { pdf } = await import("pdf-to-img");
  let counter = 1;
  const document = await pdf(pdfPath, { scale: 3 });

  for await (const image of document) {
    const outputPath = path.join(outputDir, `page${counter}.png`);
    await fs.writeFile(outputPath, image); // Using fs.promises.writeFile
    counter++;
  }

  console.log("PDF converted to images successfully.");
}

convertPdfToImages(
  "./Spinal Cord Trauma 2024.pdf",
  "pdf-to-img-images/3"
).catch((error) => {
  console.error("Error converting PDF to images", error);
});
