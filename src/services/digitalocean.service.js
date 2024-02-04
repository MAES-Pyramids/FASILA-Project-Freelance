const {
  S3Client,
  GetObjectCommand,
  PutObjectCommand,
  PutBucketPolicyCommand,
} = require("@aws-sdk/client-s3");
const policyParams = require("../utils/digitalocean");
const uuid = require("uuid").v4;

const endpoint = process.env.AWS_ENDPOINT;
const Bucket = process.env.AWS_BUCKET_NAME;

const s3client = new S3Client({
  endpoint,
  signatureVersion: "v4",
});

// Set the bucket policy
// s3client
//   .send(new PutBucketPolicyCommand(policyParams))
//   .then(() => {
//     console.log("Bucket policy updated successfully.");
//   })
//   .catch((error) => {
//     console.error("Error updating bucket policy:", error);
//   });

const s3UploadV3 = async (files, uploadedFor) => {
  const [params, FileNames] = [[], []];
  const generateKey = (prefix, file) => {
    return `${prefix}/${uuid()}-${file.originalname}`;
  };

  for (let file of files) {
    let Key;

    switch (uploadedFor) {
      case "subject-Preview":
        Key = generateKey("PDFs/Previews", file);
        break;
      case "subject-Purchased":
        Key = generateKey("PDFs/Purchased", file);
        break;
      case "doctor":
        Key = generateKey("Doctors/Avatars", file);
        break;
      case "student":
        Key = generateKey("Students/Faculty_Cards", file);
        break;
    }

    params.push({
      Key,
      Bucket,
      Body: file.buffer,
    });

    FileNames.push(Key);
  }

  try {
    const result = await Promise.all(
      params.map((param) => s3client.send(new PutObjectCommand(param)))
    );
    console.log(result);
    return { status: true, FileNames };
  } catch (err) {
    return { status: false, message: err.message };
  }
};

// we need getPresignedURL function to view Protected Routes
const getPresignedURL = async (Key) => {};

module.exports = { s3client, s3UploadV3 };
