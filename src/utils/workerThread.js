const { parentPort, workerData } = require("worker_threads");
const { addWatermarkAndEmptyPages } = require("./pdf.utils");

const { inputFileURL, outputFilePath, watermarkPhone } = workerData;
addWatermarkAndEmptyPages(inputFileURL, outputFilePath, watermarkPhone, true, {
  addTwoEmptyPagesAtEnd: false,
  addEmptyPageAfter: 2,
})
  .then((res) => {
    parentPort.postMessage({ status: res.status, message: res.message });
  })
  .catch((err) => {
    parentPort.postMessage({ success: false, message: err.message });
  });
