const {
  S3Client,
  GetObjectCommand,
  PutObjectCommand,
  PutBucketPolicyCommand,
} = require("@aws-sdk/client-s3");
const { getSignedUrl } = require("@aws-sdk/s3-request-presigner");
const policyParams = require("../utils/digitalocean");
const uuid = require("uuid").v4;

const endpoint = process.env.AWS_ENDPOINT;
const Bucket = process.env.AWS_BUCKET_NAME;
const expiresIn = process.env.AWS_READ_EXPIRE_IN;

const s3client = new S3Client({
  endpoint,
  signatureVersion: "v4",
});

// Set the bucket policy
s3client
  .send(new PutBucketPolicyCommand(policyParams))
  .then(() => {
    console.log("Bucket policy updated successfully.");
  })
  .catch((error) => {
    console.error("Error updating bucket policy:", error);
  });

const s3UploadDocuments = async (files, uploadedFor) => {
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
      ContentType: file.mimetype,
      ACL: uploadedFor !== "student" ? "public-read" : "private",
    });
    FileNames.push(`https://${Bucket}.ams3.digitaloceanspaces.com/${Key}`);
  }

  try {
    const result = await Promise.all(
      params.map((param) => s3client.send(new PutObjectCommand(param)))
    );

    if (result) return { status: true, FileNames };
    else return { status: false, message: "Error uploading files." };
  } catch (err) {
    return { status: false, message: err.message };
  }
};

const s3UploadModifiedPDF = async (PdfBytes) => {
  const Key = `PDFs/Purchases/${uuid()}-modified.pdf`;
  const params = {
    Key,
    Bucket,
    Body: PdfBytes,
    ContentType: "application/pdf",
    ACL: "private",
  };

  try {
    const result = await s3client.send(new PutObjectCommand(params));

    if (result) {
      const fileUrl = Key;
      return { status: true, fileUrl };
    } else {
      return { status: false, message: "Error uploading modified PDF." };
    }
  } catch (err) {
    return { status: false, message: err.message };
  }
};

const s3GetTempViewURL = async (Key) => {
  const params = {
    Key,
    Bucket,
    ContentType: "application/pdf",
  };

  const conditions = {
    acl: "public-read",
    "Content-Type": "application/pdf",
    key: Key,
  };

  try {
    const tempUrl = await getSignedUrl(s3client, new GetObjectCommand(params), {
      expiresIn,
      conditions,
    });

    return tempUrl;
  } catch (error) {
    return null;
  }
};

module.exports = {
  s3client,
  s3GetTempViewURL,
  s3UploadDocuments,
  s3UploadModifiedPDF,
};
