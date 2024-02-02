const endPoint = "http://127.0.0.1:3000/api/v1/sessions";
const accessToken =
  "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2NWI0NjMzMTE3MDA0MmE1MTE1MDhmMDIiLCJmaXJzdF9uYW1lIjoiTW9oYW1lZCIsImxhc3RfbmFtZSI6IkFibyBFbCBTZW91ZCIsInBob25lIjoiMjAxMDA3MDQ1OTkzIiwiZ2VuZGVyIjoibWFsZSIsInNlbWVzdGVyIjo4LCJmYWN1bHR5IjoiNjVhZDU4NTZiMzJkZTBkN2ZiYTFhOGNkIiwidGVsZWdyYW1JZCI6IjEzMTYwMTkzOTEiLCJ0ZWxlZ3JhbVN0YXR1cyI6ImFjdGl2ZSIsInZlcmlmaWVkIjp0cnVlLCJzdXNwZW5kZWQiOmZhbHNlLCJjcmVhdGVkQXQiOiIyMDI0LTAxLTI3VDAxOjU4OjA5LjQ5OVoiLCJ1cGRhdGVkQXQiOiIyMDI0LTAxLTMxVDAyOjI4OjQ3LjE5MloiLCJmb3JjZUxvZ291dEF0IjoiMjAyNC0wMS0yOFQwMTozMjowNS4xMDhaIiwid2FsbGV0Ijp7Il9pZCI6IjY1YmJmOGZlM2RiOTFhYTg3NjE2OGRlZCIsImJhbGFuY2UiOnsiJG51bWJlckRlY2ltYWwiOiIzNS42In19LCJyb2xlIjoiU3R1ZGVudCIsInNlc3Npb24iOiI2NWJjM2I5OWNmNTVhMTBhMDU2NTVmMDIiLCJpYXQiOjE3MDY4NDExMTEsImV4cCI6MTcwNjg0MTEyMX0.FCp5rS1EVauDEBIvVNXX67gQAG9ERfbf47E158WzM8V6reZQEPLAGqw3dFwdm3CD8ku8qfx03PBJAu7Y0kOCcIEXKp3-cnrlKgNSVceYNk4vi-OszqMF6Bt5GjcDIg_d9DX026kLigkiBgEFKFGIB4ghV1VXwvqOxCQ_8csU5KojkQDDlhxVNAGbCf01IX3cAuf_y-TswiVLbFP52QLRHK24_pm0esZ1KvdbQQBiKFTXOm2k10vXBaveC6etZFxhhIrcR-pZ3OEgwIOn-QyPgoZDugCn7LHSukExRx6p5BOih0_ZcyeHcxIQj_NeGIzT6PgyMLc9PMTTpNlXROX6nQ";
const xRefreshValue =
  "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2NWI0NjMzMTE3MDA0MmE1MTE1MDhmMDIiLCJmaXJzdF9uYW1lIjoiTW9oYW1lZCIsImxhc3RfbmFtZSI6IkFibyBFbCBTZW91ZCIsInBob25lIjoiMjAxMDA3MDQ1OTkzIiwiZ2VuZGVyIjoibWFsZSIsInNlbWVzdGVyIjo4LCJmYWN1bHR5IjoiNjVhZDU4NTZiMzJkZTBkN2ZiYTFhOGNkIiwidGVsZWdyYW1JZCI6IjEzMTYwMTkzOTEiLCJ0ZWxlZ3JhbVN0YXR1cyI6ImFjdGl2ZSIsInZlcmlmaWVkIjp0cnVlLCJzdXNwZW5kZWQiOmZhbHNlLCJjcmVhdGVkQXQiOiIyMDI0LTAxLTI3VDAxOjU4OjA5LjQ5OVoiLCJ1cGRhdGVkQXQiOiIyMDI0LTAxLTMxVDAyOjI4OjQ3LjE5MloiLCJmb3JjZUxvZ291dEF0IjoiMjAyNC0wMS0yOFQwMTozMjowNS4xMDhaIiwid2FsbGV0Ijp7Il9pZCI6IjY1YmJmOGZlM2RiOTFhYTg3NjE2OGRlZCIsImJhbGFuY2UiOnsiJG51bWJlckRlY2ltYWwiOiIzNS42In19LCJyb2xlIjoiU3R1ZGVudCIsInNlc3Npb24iOiI2NWJjM2I5OWNmNTVhMTBhMDU2NTVmMDIiLCJpYXQiOjE3MDY4MzQ4NDEsImV4cCI6MTcwNzI2Njg0MX0.JSqGg64zG6VLommVPY-RE2icC6a11k0CndHgWTzu4q1hsIk8DabCyE1dVVGyEdrl_H44kUEDp-imF5B6BUscpqKPfRyycYd1hUlYKBAj7Cs-fP_op3ZzTJlWQ-Ze88U5_Z6VwYX-xE5yRMFqSBibIoZGiZDcH7w7vpArOtoMr-k30kDR68gCpFqYkhpdptAQI4_IktxDQO7kf_JX1KINyoCUlo4jy2EcA9ViXaRbbg0PpJxXY3vlT4FLe9zyl7--L4nhDTMAr6vm582249NweaB7nmesD4VOk-uB4TUIxcrbCg2Hv9UbFuKxPg_xkbu44TvofxjOFDNMu1Sc5Ah4yQ";

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
