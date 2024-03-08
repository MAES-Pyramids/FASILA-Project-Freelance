const AWS = require("aws-sdk");
const { v4: uuidv4 } = require("uuid"); // For generating a unique object key

// DigitalOcean Spaces configuration
const endpoint = "https://nyc3.digitaloceanspaces.com"; // Update with your region's endpoint
const spaceName = "your-space-name";
const accessKey = "your-digitalocean-access-key";
const secretKey = "your-digitalocean-secret-key";

// Function to generate a temporary URL
function generateTempUrl(objectKey, expirationTimeInSeconds = 3600) {
  const s3 = new AWS.S3({
    endpoint: new AWS.Endpoint(endpoint),
    accessKeyId: accessKey,
    secretAccessKey: secretKey,
  });

  const params = {
    Bucket: spaceName,
    Key: objectKey,
    Expires: expirationTimeInSeconds,
    ContentType: "application/octet-stream", // Set the content type based on your file type
  };

  return s3.getSignedUrlPromise("putObject", params);
}

// Example usage
const objectKey = `uploads/faculty_card_${uuidv4()}.jpg`; // Unique object key using UUID
const expirationTimeInSeconds = 3600; // 1 hour expiration time

generateTempUrl(objectKey, expirationTimeInSeconds)
  .then((tempUrl) => {
    console.log("Temporary URL:", tempUrl);

    // Pass the tempUrl to the client for faculty card upload
  })
  .catch((error) => {
    console.error("Error generating temporary URL:", error);
  });
