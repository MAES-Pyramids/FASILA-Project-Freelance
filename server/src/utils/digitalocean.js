const bucketName = process.env.AWS_BUCKET_NAME;

const bucketPolicy = {
  Version: "2012-10-17",
  Statement: [
    {
      Effect: "Allow",
      Principal: "*",
      Action: ["s3:GetObject", "s3:GetObjectVersion"],
      Resource: [
        `arn:aws:s3:::${bucketName}/PDFs/Previews*`,
        `arn:aws:s3:::${bucketName}/Doctors/Avatars*`,
        `arn:aws:s3:::${bucketName}/Subjects/Previews*`,
        `arn:aws:s3:::${bucketName}/Students/Faculty_Cards*`,
      ],
      Condition: {
        StringLike: {
          "aws:Referer": [
            "https://fasila-lib-electronic.vercel.app/*",
            "https://www.fasila-lib-electronic.vercel.app/*",
          ],
        },
      },
    },
    {
      Effect: "Deny",
      Principal: "*",
      Action: "s3:GetObject",
      Resource: [
        `arn:aws:s3:::${bucketName}/PDFs/Uploads*`,
        `arn:aws:s3:::${bucketName}/PDFs/Purchases*`,
        `arn:aws:s3:::${bucketName}/Students/Faculty_Cards*`,
      ],
      Condition: {
        StringNotEquals: {
          "aws:PrincipalType": "Service",
          "aws:requester": "s3.amazonaws.com",
        },
      },
    },
    {
      Effect: "Deny",
      Principal: "*",
      Action: "s3:DeleteObject",
      Resource: [
        `arn:aws:s3:::${bucketName}/PDFs/Uploads*`,
        `arn:aws:s3:::${bucketName}/PDFs/Previews*`,
        `arn:aws:s3:::${bucketName}/PDFs/Purchases*`,
        `arn:aws:s3:::${bucketName}/Doctors/Avatars*`,
        `arn:aws:s3:::${bucketName}/Subjects/Previews*`,
        `arn:aws:s3:::${bucketName}/Students/Faculty_Cards`,
      ],
      Condition: {
        StringNotEquals: {
          "aws:PrincipalType": "Service",
          "aws:requester": "s3.amazonaws.com",
        },
      },
    },
    {
      Effect: "Deny",
      Principal: "*",
      Action: "s3:PutBucketPolicy",
      Resource: [
        `arn:aws:s3:::${bucketName}/PDFs/Uploads*`,
        `arn:aws:s3:::${bucketName}/PDFs/Previews*`,
        `arn:aws:s3:::${bucketName}/PDFs/Purchases*`,
        `arn:aws:s3:::${bucketName}/Doctors/Avatars*`,
        `arn:aws:s3:::${bucketName}/Subjects/Previews*`,
        `arn:aws:s3:::${bucketName}/Students/Faculty_Cards`,
      ],
      Condition: {
        StringNotEquals: {
          "aws:PrincipalType": "Service",
          "aws:requester": "s3.amazonaws.com",
        },
      },
    },
  ],
};

const policyParams = {
  Bucket: bucketName,
  Policy: JSON.stringify(bucketPolicy),
};

const corsParams = {
  Bucket: bucketName,
  CORSConfiguration: {
    CORSRules: [
      {
        AllowedHeaders: ["*"],
        AllowedMethods: ["GET", "PUT", "DELETE"],
        AllowedOrigins: ["https://fasila-lib-electronic.vercel.app"],
        MaxAgeSeconds: 3000,
      },
    ],
  },
};

module.exports = { corsParams, policyParams };
