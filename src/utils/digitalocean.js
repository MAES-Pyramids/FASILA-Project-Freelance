const bucketName = process.env.DigitalOcean_BucketName;

const bucketPolicy = {
  Version: "2012-10-17",
  Statement: [
    {
      Effect: "Allow",
      Principal: "*",
      Action: "s3:GetObject",
      Resource: `arn:aws:s3:::${bucketName}/*`,
    },
    {
      Effect: "Deny",
      Principal: "*",
      Action: "s3:GetObject",
      Resource: `arn:aws:s3:::${bucketName}/PDFs/Uploads*`,
    },
    {
      Effect: "Deny",
      Principal: "*",
      Action: "s3:GetObject",
      Resource: `arn:aws:s3:::${bucketName}/PDFs/Purchases*`,
    },
    {
      Effect: "Deny",
      Principal: "*",
      Action: "s3:GetObject",
      Resource: `arn:aws:s3:::${bucketName}/Students/Faculty_Cards*`,
    },
  ],
};

const policyParams = {
  Bucket: bucketName,
  Policy: JSON.stringify(bucketPolicy),
};

module.exports = policyParams;
