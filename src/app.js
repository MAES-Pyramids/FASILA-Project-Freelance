const cors = require("cors");
const path = require("path");
const morgan = require("morgan");
const express = require("express");
const cookieParser = require("cookie-parser");

const hpp = require("hpp");
const xss = require("xss-clean");
// const helmet = require('helmet');
const compression = require("compression");
const rateLimit = require("express-rate-limit");
const mongoSanitize = require("express-mongo-sanitize");

const AppError = require("./utils/appErrorsClass");
const globalErrorHandler = require("./middlewares/errorHandler");

const StudentRoutes = require("./routes/student.routes.js");
const FacultyRoutes = require("./routes/faculty.routes.js");
const universityRoutes = require("./routes/university.routes.js");

//-------------------------------------------//
const app = express();
//------------Global middleware--------------//
app.enable("trust proxy", 1);

app.use(cors());
app.options("*", cors());

// Serve static content located in the "public" directory.
app.use(express.static(path.join(__dirname, "public")));

app.use(
  process.env.NODE_ENV === "development" ? morgan("dev") : morgan("combined")
);

const limiter = rateLimit({
  max: 100,
  windowMs: 30 * 60 * 1000,
  message: "Too many requests from this IP, please try again in an hour!",
});
app.use("/api", limiter);

app.use(express.json({ limit: "10kb" }));
app.use(cookieParser());
app.use(mongoSanitize());
app.use(xss());

// FIXME:  uncomment this in production to set the only required parameters to be sent to the server
// Prevent parameter pollution
// app.use(
//   hpp({
//     whitelist: [
//       "duration",
//       "ratingsQuantity",
//       "ratingsAverage",
//     ],
//   })
// );

app.use(compression());
//--------------Global Routing--------------//
app.use("/api/v1/Students", StudentRoutes);
app.use("/api/v1/Faculties", FacultyRoutes);
app.use("/api/v1/Universities", universityRoutes);

//FIXME  just to determined the exact number of proxy servers in front of our application so that we can set proxy trust to true without any issues with the rate limiter middleware but remember to remove it in production
app.get("/ip", (req, res) => {
  res.send(req.ip);
});

app.all("*", (req, res, next) => {
  next(
    new AppError(
      `Sorry, the page you are trying to access is not available`,
      404
    )
  );
});

//-------------------------------------------//
// Error Handling Middleware
app.use(globalErrorHandler);
//-------------------------------------------//
module.exports = app;
