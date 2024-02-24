const {
  S3Client,
  GetObjectCommand,
  PutObjectCommand,
  HeadObjectCommand,
  DeleteObjectCommand,
  PutBucketCorsCommand,
  PutBucketPolicyCommand,
} = require("@aws-sdk/client-s3");
const { getSignedUrl } = require("@aws-sdk/s3-request-presigner");
const { policyParams, corsParams } = require("../utils/digitalocean");
const sharp = require("sharp");
const uuid = require("uuid").v4;

const endpoint = process.env.AWS_ENDPOINT;
const Bucket = process.env.AWS_BUCKET_NAME;
const expiresIn = process.env.AWS_READ_EXPIRE_IN;

const s3client = new S3Client({
  endpoint,
  signatureVersion: "v4",
});

// // Set the bucket policy
s3client
  .send(new PutBucketPolicyCommand(policyParams))
  .then(() => {
    console.log("Bucket policy updated successfully.");
  })
  .catch((error) => {
    console.error("Error updating bucket policy:", error);
  });

// // Set the CORS configuration
// s3client
//   .send(new PutBucketCorsCommand(corsParams))
//   .then(() => {
//     console.log("CORS configuration updated successfully.");
//   })
//   .catch((error) => {
//     console.error("Error updating CORS configuration:", error);
//   });

const s3UploadDocuments = async (files, uploadedFor) => {
  const [params, FileNames] = [[], []];

  const generateKey = (prefix, file) => {
    const isImage = file.mimetype.startsWith("image/");
    const fileExtension = isImage ? "png" : file.originalname.split(".").pop();
    return `${prefix}/${uuid()}-${file.originalname.replace(
      /\.[^/.]+$/,
      ""
    )}.${fileExtension}`;
  };

  for (let file of files) {
    let Key;

    switch (uploadedFor) {
      case "pdf-preview":
        Key = generateKey("PDFs/Previews", file);
        break;
      case "doctor":
        Key = generateKey("Doctors/Avatars", file);
        break;
      case "subject":
        Key = generateKey("Subjects/Previews", file);
        break;
      case "student":
        Key = generateKey("Students/Faculty_Cards", file);
        break;
    }

    const isImage = file.mimetype.startsWith("image/");
    const buffer = isImage
      ? await sharp(file.buffer).toFormat("png").toBuffer()
      : file.buffer;

    params.push({
      Key,
      Bucket,
      Body: buffer,
      ContentType: uploadedFor == "student" ? "image/png" : file.mimetype,
      // ACL: uploadedFor !== "student" ? "public-read" : "private",
      ACL: "private",
    });

    if (uploadedFor !== "student")
      FileNames.push(`https://${Bucket}.ams3.digitaloceanspaces.com/${Key}`);
    else FileNames.push(Key);
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
      return { status: true, key: Key };
    } else {
      return { status: false, message: "Error uploading modified PDF." };
    }
  } catch (err) {
    return { status: false, message: err.message };
  }
};

const s3GetTempViewURL = async (Key, format) => {
  const params = {
    Key,
    Bucket,
    ContentType: format,
  };

  const conditions = {
    acl: "public-read",
    key: Key,
  };

  try {
    // const tempUrl = await getSignedUrl(s3client, new GetObjectCommand(params), {
    //   expiresIn,
    //   conditions,
    // });

    const tempUrl = `https://${Bucket}.ams3.digitaloceanspaces.com/${Key}`; //TODO:Remove

    return tempUrl;
  } catch (error) {
    return null;
  }
};

const checkIfDocumentExist = async (Key) => {
  const headObjectCommand = new HeadObjectCommand({ Bucket, Key });

  try {
    const data = await s3client.send(headObjectCommand);
    const contentType = data.ContentType;
    const creationDate = data.LastModified;

    if (!contentType.startsWith("application/pdf"))
      return { status: false, message: "Invalid document type." };

    if (new Date() - creationDate > 1000 * 60)
      return {
        status: false,
        message: "Document was created more than 1 minute ago",
      };

    return { status: true, contentType, creationDate };
  } catch (err) {
    if (err.name === "NotFound") {
      console.log("Document does not exist in the bucket.");
      return { status: false, message: err.message };
    } else {
      return { status: false, message: err };
    }
  }
};

const deleteDocument = async (Key) => {
  const deleteObjectCommand = new DeleteObjectCommand({ Bucket, Key });

  try {
    await s3client.send(deleteObjectCommand);

    return { status: true, message: "Document deleted successfully." };
  } catch (err) {
    return { status: false, message: err.message };
  }
};

module.exports = {
  s3client,
  deleteDocument,
  s3GetTempViewURL,
  s3UploadDocuments,
  s3UploadModifiedPDF,
  checkIfDocumentExist,
};
