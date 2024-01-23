const PDFWatermark = require("pdf-watermark");
const { rgb, degrees } = require("pdf-lib");

async function setWaterMark(inputFilePath, outputFilePath, watermarkText) {
  const semiTransparentColor = rgb(0.8, 0.8, 0.8);
  await PDFWatermark({
    pdf_path: inputFilePath,
    textOption: {
      diagonally: true,
      rotate: degrees(45),
      size: 60,
      opacity: 0.8,
      color: semiTransparentColor,
    },
    text: watermarkText,
    output_dir: outputFilePath,
  });
}

setWaterMark(
  "./source/DS-QB.pdf",
  "./output/watermarked_pdf_watermark.pdf",
  "01007045993"
);
