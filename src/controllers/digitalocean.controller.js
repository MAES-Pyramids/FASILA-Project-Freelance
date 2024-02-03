const { v4: uuidv4 } = require("uuid");
// const AWS = require("aws-sdk");
const fs = require("fs");
const axios = require("axios");
const {
  S3Client,
  GetObjectCommand,
  PutObjectCommand,
} = require("@aws-sdk/client-s3");
const { getSignedUrl } = require("@aws-sdk/s3-request-presigner");

const catchAsyncError = require("../utils/catchAsyncErrors");
const AppError = require("../utils/appErrorsClass");

const accessKeyId = process.env.DigitalOcean_accessKeyId;
const secretAccessKey = process.env.DigitalOcean_secretAccessKey;
const endpoint = process.env.DigitalOcean_Endpoint;
const region = process.env.DigitalOcean_region;
const bucketNames = process.env.DigitalOcean_BucketName;
console.log(accessKeyId, secretAccessKey, endpoint, region, bucketNames);

// const s3 = new AWS.S3({
//   forcePathStyle: false,
//   apiVersion: "2006-03-01",
//   endpoint: spacesEndpoint,
//   credentials: {
//     accessKeyId: accessKeyId,
//     secretAccessKey: secretAccessKey,
//   },
//   region: region,
//   signatureVersion: "v4",
// });

const s3Client = new S3Client({
  region,
  endpoint,
  credentials: {
    accessKeyId: accessKeyId,
    secretAccessKey: secretAccessKey,
  },
});

class AWSController {
  /**
   *  @description get presigned url for uploading files to s3
   *  @route /api/AWS/getPresignedURL
   *  @method GET
   *  @access public
   */
  static getPresignedURL = catchAsyncError(async (req, res, next) => {
    let bucketName, objectKey;
    const { filetype, uploadedFor } = req.query;

    // if (!filetype || !uploadedFor)
    //   return next(new AppError("filetype and uploadedFor are required"));

    // if (filetype == "application/pdf") {
    //   bucketName = "PDFs/Uploads";
    //   objectKey = `${uuidv4()}.${filetype.split("/")[1]}`;
    // } else if (
    //   filetype == "image/png" ||
    //   filetype == "image/jpg" ||
    //   filetype == "image/jpeg"
    // ) {
    //   if (uploadedFor == "doctor") {
    //     // bucketName = "Doctors/Avatars";
    //     objectKey = `${uuidv4()}.${filetype.split("/")[1]}`;
    //   } else if (uploadedFor == "student") {
    //     // bucketName = "Students/Faculty_Cards";
    //     objectKey = `${uuidv4()}.${filetype.split("/")[1]}`;
    //   } else if (uploadedFor == "subject") {
    //     // bucketName = "PDFs/Previews";
    //     objectKey = `${uuidv4()}.${filetype.split("/")[1]}`;
    //   } else {
    //     return next(new AppError("uploadedFor isn't allowed."));
    //   }
    // } else {
    //   return next(new AppError("filetype isn't allowed"));
    // }

    // const params = {
    //   Bucket: bucketNames,
    //   Key: objectKey,
    //   ContentType: "image/jpg",
    //   Expires: 1200,
    //   ACL: "private",
    // };

    const params = {
      Bucket: bucketNames, // The path to the directory you want to upload the object to, starting with your Space name.
      Key: "hello-world.txt", // Object key, referenced whenever you want to access this file later.
      Body: "Hello, World!", // The object's contents. This variable is an object, not a string.
      ContentType: "text/plain",
      ACL: "private", // Defines ACL permissions, such as private or public.
      Metadata: {
        // Defines metadata tags.
        "x-amz-meta-my-key": "your-value",
      },
    };

    // const params = {
    //   Bucket: bucketNames,
    //   Key: "hello-world.txt",
    //   ContentType: "text/plain",
    //   ACL: "private",
    //   Metadata: {
    //     // Defines metadata tags.
    //     "x-amz-meta-my-key": "your-value",
    //   },
    // };

    try {
      const command = new PutObjectCommand(params);
      const url = await getSignedUrl(s3Client, command, { expiresIn: 1200 });

      // const uploadObject = async () => {
      //   try {
      //     const data = await s3Client.send(new PutObjectCommand(params));
      //     console.log(
      //       "Successfully uploaded object: " + params.Bucket + "/" + params.Key
      //     );
      //     return data;
      //   } catch (err) {
      //     console.log("Error", err);
      //   }
      // };

      // uploadObject();

      // const url = await s3.getSignedUrlPromise("putObject", params);

      const fileContent = fs.readFileSync("./public/pdfs/hello-world.txt");

      try {
        await axios.put(url, fileContent, {
          headers: {
            "Content-Type": "text/plain",
          },
        });
      } catch (error) {
        console.log(error);
      }

      res.status(200).json({
        status: "success",
        message: "Presigned URL generated successfully",
        data: {
          objectKey,
          url,
        },
      });
    } catch (error) {
      return next(new AppError("Error generating presigned URL", error));
    }
  });
}

module.exports = AWSController;
