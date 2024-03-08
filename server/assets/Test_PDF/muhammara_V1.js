let muhammara = require("muhammara");

const inputFilePath = "./source/DS-QB.pdf";
const outputFilePath = "./output/watermarked_muhammara_H.pdf";
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

  // const pageSize = pdfReader.parsePage(pageIndex).getMediaBox();
  // const verticalOffset = 10; // Adjust this value based on your needs
  // const textY = pageSize.height - verticalOffset;

  pageModifier
    .startContext()
    .getContext()
    .writeText("01007045993", 10, 10, textOptions);

  pageModifier.endContext().writePage();
}

pdfWriter.end();
