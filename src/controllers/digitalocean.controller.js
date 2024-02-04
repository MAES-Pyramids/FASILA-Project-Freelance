const {
  S3,
  GetObjectCommand,
  PutObjectCommand,
  PutBucketPolicyCommand,
} = require("@aws-sdk/client-s3");
const { v4: uuidv4 } = require("uuid");
const { getSignedUrl } = require("@aws-sdk/s3-request-presigner");
const catchAsyncError = require("../utils/catchAsyncErrors");
const policyParams = require("../utils/digitalocean");
const AppError = require("../utils/appErrorsClass");

const endpoint = process.env.AWS_ENDPOINT;
const bucketName = process.env.AWS_BUCKET_NAME;

const s3 = new S3({
  endpoint,
  signatureVersion: "v4",
});

// Set the bucket policy
// s3.send(new PutBucketPolicyCommand(policyParams))
//   .then(() => {
//     console.log("Bucket policy updated successfully.");
//   })
//   .catch((error) => {
//     console.error("Error updating bucket policy:", error);
//   });

class AWSController {
  /**
   *  @description get presigned url for uploading files to s3
   *  @route /api/AWS/getPresignedURL
   *  @method GET
   *  @access public
   */
  static getPresignedURL = catchAsyncError(async (req, res, next) => {
    let Key;
    const { filetype, uploadedFor } = req.query;

    if (!filetype || (!uploadedFor && filetype !== "application/pdf"))
      return next(new AppError("filetype and uploadedFor are required"));

    if (filetype == "application/pdf") {
      Key = `PDFs/Uploads/${uuidv4()}.${filetype.split("/")[1]}`;
    } else if (
      filetype == "image/png" ||
      filetype == "image/jpg" ||
      filetype == "image/jpeg"
    ) {
      if (uploadedFor == "student") {
        Key = `Students/Faculty_Cards/${uuidv4()}.${filetype.split("/")[1]}`;
      } else if (uploadedFor == "doctor") {
        Key = `Doctors/Avatars/${uuidv4()}.${filetype.split("/")[1]}`;
      } else if (uploadedFor == "subject") {
        Key = `PDFs/Previews/${uuidv4()}.${filetype.split("/")[1]}`;
      } else {
        return next(new AppError("uploadedFor isn't allowed."));
      }
    } else {
      return next(new AppError("filetype isn't allowed"));
    }

    const params = {
      ContentType: filetype,
      Bucket: bucketName,
      Key,
      ACL:
        filetype !== "application/pdf" &&
        (uploadedFor == "subject" || uploadedFor == "doctor")
          ? "public-read"
          : "private",
    };

    try {
      const command = new PutObjectCommand(params);
      const url = await getSignedUrl(s3, command, { expiresIn: 1200 });
      const path = `https://${bucketName}.ams3.digitaloceanspaces.com/${Key}`;

      res.status(200).json({
        status: "success",
        message: "Presigned URL generated successfully",
        path,
        url,
      });
    } catch (error) {
      return next(new AppError("Error generating presigned URL", error));
    }
  });
}

module.exports = AWSController;
