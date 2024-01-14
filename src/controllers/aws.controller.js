const AWS = require("aws-sdk");
const AppError = require("../utils/appErrorsClass");
const catchAsyncError = require("../utils/catchAsyncErrors");

AWS.config.update({
  accessKeyId: process.env.AWS_accessKeyId,
  secretAccessKey: process.env.AWS_secretAccessKey,
  region: process.env.AWS_region,
});
const s3 = new AWS.S3();

class AWSController {
  /**
   *  @description get presigned url for uploading files to s3
   *  @route /api/AWS/getPresignedURL
   *  @method GET
   *  @access public
   */
  static getPresignedURL = catchAsyncError(async (req, res, next) => {
    const { fileName } = req.params;
    const { filetype } = req.query;

    if (!fileName || !filetype)
      return next(new AppError("fileName and filetype are required"));

    const allowedFiletypes = [
      "image/png",
      "image/jpg",
      "image/jpeg",
      "application/pdf",
    ];
    if (!allowedFiletypes.includes(filetype))
      return next(
        new AppError(
          "filetype isn't allowed, allowed filetypes are: png, jpg, jpeg, pdf"
        )
      );

    const BucketName = filetype == "application/pdf" ? "pdfs" : "images";

    const params = {
      Bucket: BucketName,
      Key: fileName,
      ContentType: filetype,
      Expires: 60,
      ACL: "public-read",
    };

    try {
      const url = await new Promise((resolve, reject) => {
        s3.getSignedUrl("putObject", params, (err, url) => {
          if (err) {
            reject(err);
          } else {
            resolve(url);
          }
        });
      });

      res.send({
        status: "success",
        message: "Presigned URL generated successfully",
        data: url,
      });
    } catch (error) {
      return next(new AppError("Error generating presigned URL"));
    }
  });
}

module.exports = AWSController;
