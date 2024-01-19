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

const wasageRoutes = require("./routes/wasage.routes.js");
const DoctorRoutes = require("./routes/doctor.routes.js");
const SessionRoutes = require("./routes/session.routes.js");
const StudentRoutes = require("./routes/student.routes.js");
const FacultyRoutes = require("./routes/faculty.routes.js");
const SubjectRoutes = require("./routes/subject.routes.js");
const universityRoutes = require("./routes/university.routes.js");

const { receiveOTP } = require("./hooks/wasage");
const requireUser = require("./middlewares/userRequired");
const DeserializeUser = require("./middlewares/userDeserialization");

//-------------------------------------------//
const app = express();
//------------Global middleware--------------//
// app.enable("trust proxy", 1);

app.use(cors());
app.options("*", cors());

app.use(express.static(path.join(__dirname, "public")));

app.use(
  process.env.NODE_ENV === "development" ? morgan("dev") : morgan("combined")
);

const limiter = rateLimit({
  max: 200,
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
app.use(DeserializeUser);
//--------------Global Routing--------------//
app.get("/api/wasage", receiveOTP);

app.get("/ip", (req, res) => {
  res.send(req.ip);
});

app.use("/api/v1/wasage", wasageRoutes);
app.use("/api/v1/sessions", SessionRoutes);
app.use("/api/v1/Students", StudentRoutes);
app.use(requireUser);
app.use("/api/v1/doctors", DoctorRoutes);
app.use("/api/v1/Subjects", SubjectRoutes);
app.use("/api/v1/Faculties", FacultyRoutes);
app.use("/api/v1/Universities", universityRoutes);

app.all("*", (req, res, next) => {
  next(
    new AppError(
      `Sorry, the requested URL ${req.originalUrl} was not found on this server.`,
      404
    )
  );
});

//-------------------------------------------//
// Error Handling Middleware
app.use(globalErrorHandler);
//-------------------------------------------//
module.exports = app;
