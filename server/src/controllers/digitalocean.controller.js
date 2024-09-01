const { getSignedUrl } = require("@aws-sdk/s3-request-presigner");
const { s3client } = require("../services/digitalocean.service");
const catchAsyncError = require("../utils/catchAsyncErrors");
const { PutObjectCommand } = require("@aws-sdk/client-s3");
const AppError = require("../utils/appErrorsClass");
const uuid = require("uuid").v4;

const bucketName = process.env.AWS_BUCKET_NAME;
const ExpireIn = process.env.AWS_UPLOAD_EXPIRE_IN;

class AWSController {
  /**
   *  @description get presigned url for uploading files to s3
   *  @route /api/AWS/getPresignedURL
   *  @method GET
   *  @access public
   */
  // static getPresignedURL = catchAsyncError(async (req, res, next) => {
  //   const { user } = req.query;

  //   let Key;
  //   if (user == "Doctor") Key = `PDFs/Uploads/${uuid()}.pdf`;
  //   if (user == "Student") Key = `PDFs/Purchases/${uuid()}-updated.pdf`;

  //   const params = {
  //     Key,
  //     Bucket: bucketName,
  //     ContentType: "application/pdf",
  //     ACL: "private",
  //   };

  //   try {
  //     const command = new PutObjectCommand(params);
  //     const url = await getSignedUrl(s3client, command, {
  //       expiresIn: ExpireIn,
  //     });

  //     res.status(200).json({
  //       status: "success",
  //       Key,
  //       url,
  //     });
  //   } catch (error) {
  //     return next(new AppError("Error generating presigned URL", error));
  //   }
  // });
  static getPresignedURL = catchAsyncError(async (req, res, next) => {
    const { user } = req.query;

    let Key;
    if (user == "Doctor") Key = `PDFs/Uploads/${uuid()}.pdf`;
    if (user == "Student") Key = `PDFs/Purchases/${uuid()}-updated.json`;

    const params = {
      Key,
      Bucket: bucketName,
      ContentType: "application/json",
      ACL: "private",
    };

    try {
      const command = new PutObjectCommand(params);
      const url = await getSignedUrl(s3client, command, {
        expiresIn: ExpireIn,
      });

      res.status(200).json({
        status: "success",
        Key,
        url,
      });
    } catch (error) {
      return next(new AppError("Error generating presigned URL", error));
    }
  });
}

module.exports = AWSController;
