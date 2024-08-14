const fs = require("fs");
const path = require("path");
const poppler = require("pdf-poppler");

async function convertPdfToImages(pdfPath, outputDir) {
  if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir);

  const options = {
    format: "png",
    out_dir: outputDir,
    out_prefix: path.basename(pdfPath, path.extname(pdfPath)),
    scale: 1.5,
  };

  try {
    await poppler.convert(pdfPath, options);
    // await compressImages(
    //   outputDir,
    //   path.basename(pdfPath, path.extname(pdfPath))
    // );
  } catch (error) {
    console.error("Error converting PDF to images", error);
  }
}

// async function compressImages(outputDir, filePrefix) {
//   const pngFiles = fs
//     .readdirSync(outputDir)
//     .filter((file) => file.endsWith(".png") && file.startsWith(filePrefix));
//   const tarPath = path.join(outputDir, `${filePrefix}.tar`);
//   const gzipPath = `${tarPath}.gz`;

//   try {
//     await tar.c({ file: tarPath, cwd: outputDir }, pngFiles);

//     const gzipStream = fs.createWriteStream(gzipPath);
//     const tarStream = fs.createReadStream(tarPath);
//     const gzip = zlib.createGzip();

//     tarStream
//       .pipe(gzip)
//       .pipe(gzipStream)
//       .on("finish", () => {
//         console.log("Images compressed successfully into", gzipPath);

//         fs.unlinkSync(tarPath);
//         pngFiles.forEach((file) => fs.unlinkSync(path.join(outputDir, file)));
//       });
//   } catch (err) {
//     console.error("Error creating tar.gz file", err);
//   }
// }

convertPdfToImages("./Spinal Cord Trauma 2024.pdf", "pdf-poppler-images");
