const bucketPolicy = {
  Version: "2012-10-17",
  Statement: [
    {
      Effect: "Allow",
      Principal: "*",
      Action: "s3:GetObject",
      Resource: `arn:aws:s3:::${bucketName}/*`,
    },
  ],
};

const params = {
  Bucket: bucketName,
  Policy: JSON.stringify(bucketPolicy),
};

s3.send(new PutBucketPolicyCommand(params))
  .then(() => {
    console.log("Bucket policy updated successfully.");
  })
  .catch((error) => {
    console.error("Error updating bucket policy:", error);
  });
