// const s3 = new AWS.S3({
//   accessKeyId: accessKeyId,
//   secretAccessKey: secretAccessKey,
//   endpoint: new AWS.Endpoint(endpoint),
// });

// const uploadParams = {
//   Bucket: spaceName,
//   Key: objectKey,
//   Body: modifiedPdfBytes,
// };

// try {
//   await s3.upload(uploadParams).promise();
//   console.log("Watermark and empty pages added successfully! PDF uploaded to DigitalOcean Spaces.");
// } catch (error) {
//   console.error("Error uploading PDF to DigitalOcean Spaces:", error);
// }
