const endPoint = "http://127.0.0.1:3000/api/v1/sessions";
const accessToken = "";
const xRefreshValue = "";

axios
  .get(endPoint, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "x-refresh": xRefreshValue,
    },
  })
  .then((response) => {
    console.log("Response:", response.headers);
    if (response.headers["x-access-token"]) {
      console.log(
        "x-access-token found in response headers:",
        response.headers["x-access-token"]
      );
    } else {
      console.log("x-access-token not found in response headers");
    }
  })
  .catch((error) => {
    console.error("Error:", error.message);
  });
