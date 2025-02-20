const fs = require("fs");
const cors = require("cors");
const path = require("path");
const morgan = require("morgan");
const express = require("express");
const cookieParser = require("cookie-parser");

const hpp = require("hpp");
const xss = require("xss-clean");
// const helmet = require('helmet');
const compression = require("compression");
const CircularJSON = require("circular-json");
const rateLimit = require("express-rate-limit");
const mongoSanitize = require("express-mongo-sanitize");

const AppError = require("./utils/appErrorsClass");
const globalErrorHandler = require("./middlewares/errorHandler");

const AdminRoutes = require("./routes/admin.routes.js");
const wasageRoutes = require("./routes/wasage.routes.js");
const DoctorRoutes = require("./routes/doctor.routes.js");
const SessionRoutes = require("./routes/session.routes.js");
const StudentRoutes = require("./routes/student.routes.js");
const FacultyRoutes = require("./routes/faculty.routes.js");
const LectureRoutes = require("./routes/lecture.routes.js");
const SubjectRoutes = require("./routes/subject.routes.js");
const PLectureRoutes = require("./routes/plecture.routes.js");
const DigitalOcean = require("./routes/digitalocean.routes.js");
const StatisticsRoutes = require("./routes/statistics.routes.js");
const UniversityRoutes = require("./routes/university.routes.js");

const { receiveOTP } = require("./hooks/wasage");
const { receivePayment } = require("./hooks/paymob.js");
const DeserializeUser = require("./middlewares/userDeserialization");

//-------------------------------------------//
const app = express();
//------------Global middleware--------------//
app.set("trust proxy", 1);

// Set the view engine and the views directory
app.set("view engine", "pug");
app.set("views", path.join(__dirname, "..", "views"));

const corsOptions = {
  origin: "*",
  methods: "GET,PUT,PATCH,POST,DELETE",
  credentials: true,
  optionsSuccessStatus: 204,
  allowedHeaders: "*",
};

app.use(cors(corsOptions));
app.options("*", cors(corsOptions));

app.use(express.static(path.join(__dirname, "..", "public")));

const accessLogStream = fs.createWriteStream(
  path.join(__dirname, "..", "logs", "access.log"),
  { flags: "a" }
);
app.use(
  process.env.NODE_ENV === "development"
    ? morgan("dev")
    : morgan("combined", { stream: accessLogStream })
);

const limiter = rateLimit({
  max: 500,
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
app.post("/api/acceptance/post_pay", receivePayment);

app.get("/ip", (req, res) => {
  res.send(req.ip);
});

app.use("/api/v1/admins", AdminRoutes);
app.use("/api/v1/wasage", wasageRoutes);
app.use("/api/v1/doctors", DoctorRoutes);
app.use("/api/v1/Subjects", SubjectRoutes);
app.use("/api/v1/sessions", SessionRoutes);
app.use("/api/v1/Lectures", LectureRoutes);
app.use("/api/v1/Students", StudentRoutes);
app.use("/api/v1/Faculties", FacultyRoutes);
app.use("/api/v1/PLectures", PLectureRoutes);
app.use("/api/v1/DigitalOcean", DigitalOcean);
app.use("/api/v1/statistics", StatisticsRoutes);
app.use("/api/v1/Universities", UniversityRoutes);

app.all("*", (req, res, next) => {
  const error = new AppError(
    `Sorry, the requested URL ${req.originalUrl} was not found on this server.`,
    404
  );

  // Render the 404 Pug template
  res.status(error.statusCode).render("404", { message: error.message });
});

//-------------------------------------------//
// Error Handling Middleware
app.use(globalErrorHandler);
//-------------------------------------------//
module.exports = app;
