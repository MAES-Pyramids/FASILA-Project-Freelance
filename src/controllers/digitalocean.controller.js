const {
  GetObjectCommand,
  PutObjectCommand,
  PutBucketPolicyCommand,
} = require("@aws-sdk/client-s3");
const uuid = require("uuid").v4;
const { getSignedUrl } = require("@aws-sdk/s3-request-presigner");
const { s3client } = require("../services/digitalocean.service");
const catchAsyncError = require("../utils/catchAsyncErrors");
const policyParams = require("../utils/digitalocean");
const AppError = require("../utils/appErrorsClass");

const endpoint = process.env.AWS_ENDPOINT;
const bucketName = process.env.AWS_BUCKET_NAME;

// Set the bucket policy
// s3client.send(new PutBucketPolicyCommand(policyParams))
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
    const Key = `PDFs/Uploads/${uuid()}.pdf`;

    const params = {
      Key,
      Bucket: bucketName,
      ContentType: "application/pdf",
      ACL: "private",
    };

    try {
      const command = new PutObjectCommand(params);
      const url = await getSignedUrl(s3client, command, { expiresIn: 1200 });
      const path = `https://${bucketName}.ams3.digitaloceanspaces.com/${Key}`;

      res.status(200).json({
        status: "success",
        path,
        url,
      });
    } catch (error) {
      return next(new AppError("Error generating presigned URL", error));
    }
  });
}

module.exports = AWSController;
