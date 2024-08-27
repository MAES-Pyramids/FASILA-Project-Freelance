const { parentPort, workerData } = require("worker_threads");
const { addWatermarkAndEmptyPages } = require("./pdf.utils");
const { addWatermarkAndEmptyPagesAndConvertToImages } = require("./pdf2.utils");

const {
  inputFileURL,
  watermarkPhone,
  facultyCardPath,
  waterMarkDetails,
  emptyPageDetails,
} = workerData;

const opacity = parseFloat(waterMarkDetails.opacity);

addWatermarkAndEmptyPagesAndConvertToImages(
  inputFileURL,
  watermarkPhone,
  facultyCardPath,
  { ...waterMarkDetails, opacity },
  emptyPageDetails
)
  .then((res) => {
    parentPort.postMessage({
      status: res.status,
      key: res.path,
      password: res.password,
    });
  })
  .catch((err) => {
    parentPort.postMessage({ success: false, message: err.message });
  });
