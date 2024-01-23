let muhammara = require("muhammara");

const inputFilePath = "./source/Text_photos.pdf";
const outputFilePath = "./output/Text_photos_watermarked.pdf";
const fontFilePath = "./Roboto-Regular.ttf";

const pdfWriter = muhammara.createWriterToModify(
  new muhammara.PDFRStreamForFile(inputFilePath),
  new muhammara.PDFWStreamForFile(outputFilePath)
);

const pdfReader = muhammara.createReader(
  new muhammara.PDFRStreamForFile(inputFilePath)
);

const font = pdfWriter.getFontForFile(fontFilePath);
const text = "01007045993";
const textSize = 50;
const innerSpace = 40; // Adjust the inner space as needed
const textOptions = {
  font,
  size: textSize,
  colorspace: "gray",
  color: 0x8cb4cd,
};

for (let pageIndex = 0; pageIndex < pdfReader.getPagesCount(); pageIndex++) {
  const pageModifier = new muhammara.PDFPageModifier(pdfWriter, pageIndex);

  const context = pageModifier.startContext().getContext();

  // Calculate center coordinates
  const pageWidth = pdfReader.parsePage(pageIndex).getMediaBox()[2];
  const pageHeight = pdfReader.parsePage(pageIndex).getMediaBox()[3];
  const centerX = pageWidth / 2;
  const centerY = pageHeight / 2;

  // Set the rotation angle to draw text diagonally (45 degrees)
  const rotationAngle = Math.PI / 4; // 45 degrees in radians
  context.q();
  context.cm(
    Math.cos(rotationAngle),
    Math.sin(rotationAngle),
    -Math.sin(rotationAngle),
    Math.cos(rotationAngle),
    centerX,
    centerY
  );

  // Calculate the position to center the text
  const { width: textWidth } = font.calculateTextDimensions(text, textSize);
  const textHeight = textSize; // Assuming the text height is the same as the font size
  const textX = -textWidth / 2 - innerSpace / 2;
  const textY = -textHeight / 2 + innerSpace / 2;

  // Write text with added inner space
  for (let i = 0; i < text.length; i++) {
    const char = text[i];
    context.writeText(char, textX + i * innerSpace, textY, textOptions);
  }

  context.Q();

  pageModifier.endContext().writePage();
}

pdfWriter.end();
