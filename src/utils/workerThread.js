const { parentPort, workerData } = require("worker_threads");
const { addWatermarkAndEmptyPages } = require("./pdf.utils");

const { inputFileURL, watermarkPhone, waterMarkDetails, emptyPageDetails } =
  workerData;

const opacity = parseFloat(waterMarkDetails.opacity);

addWatermarkAndEmptyPages(
  inputFileURL,
  watermarkPhone,
  { ...waterMarkDetails, opacity },
  emptyPageDetails
)
  .then((res) => {
    parentPort.postMessage({ status: res.status, key: res.path });
  })
  .catch((err) => {
    parentPort.postMessage({ success: false, message: err.message });
  });
