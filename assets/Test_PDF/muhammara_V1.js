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
const textOptions = {
  font,
  size: 50,
  colorspace: "gray",
  color: 0x808080,
};

for (let pageIndex = 0; pageIndex < pdfReader.getPagesCount(); pageIndex++) {
  const pageModifier = new muhammara.PDFPageModifier(pdfWriter, pageIndex);

  pageModifier
    .startContext()
    .getContext()
    .writeText("01007045993", 200, 200, textOptions);

  pageModifier.endContext().writePage();
}

pdfWriter.end();
