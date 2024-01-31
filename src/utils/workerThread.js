const { parentPort, workerData } = require("worker_threads");
const { addWatermarkAndEmptyPages } = require("./pdf.utils");

const {
  inputFileURL,
  outputFilePath,
  watermarkPhone,
  waterMarkDetails,
  emptyPageDetails,
} = workerData;

addWatermarkAndEmptyPages(
  inputFileURL,
  outputFilePath,
  watermarkPhone,
  waterMarkDetails,
  emptyPageDetails
)
  .then((res) => {
    parentPort.postMessage({ status: res.status, message: res.message });
  })
  .catch((err) => {
    parentPort.postMessage({ success: false, message: err.message });
  });
