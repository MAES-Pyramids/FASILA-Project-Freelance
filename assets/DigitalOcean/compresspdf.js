const { execSync } = require("child_process");

const compressPDF = (inputPath, outputPath) => {
  try {
    execSync(
      `gs -sDEVICE=pdfwrite -dCompatibilityLevel=1.4 -dPDFSETTINGS=/screen -dNOPAUSE -dQUIET -dBATCH -sOutputFile=${outputPath} ${inputPath}`
    );
    return true;
  } catch (error) {
    console.error("Error compressing PDF:", error.message);
    return false;
  }
};

const s3UploadCompressedPDF = async (PdfBytes) => {
  const originalPdfKey = `PDFs/Purchases/${uuid()}-original.pdf`;
  const compressedPdfKey = `PDFs/Purchases/${uuid()}-compressed.pdf`;

  // Upload the original PDF
  const originalParams = {
    Key: originalPdfKey,
    Bucket,
    Body: PdfBytes,
    ContentType: "application/pdf",
    ACL: "private",
  };

  try {
    await s3client.send(new PutObjectCommand(originalParams));
  } catch (err) {
    return {
      status: false,
      message: `Error uploading original PDF: ${err.message}`,
    };
  }

  // Compress the PDF
  if (compressPDF(originalPdfKey, compressedPdfKey)) {
    // Upload the compressed PDF
    const compressedParams = {
      Key: compressedPdfKey,
      Bucket,
      Body: fs.readFileSync(compressedPdfKey),
      ContentType: "application/pdf",
      ACL: "private",
    };

    try {
      const result = await s3client.send(
        new PutObjectCommand(compressedParams)
      );

      if (result) {
        return { status: true, key: compressedPdfKey };
      } else {
        return { status: false, message: "Error uploading compressed PDF." };
      }
    } catch (err) {
      return {
        status: false,
        message: `Error uploading compressed PDF: ${err.message}`,
      };
    }
  } else {
    return { status: false, message: "Error compressing PDF." };
  }
};
