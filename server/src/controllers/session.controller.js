const {
  createSession,
  deleteSession,
  checkExistingSession,
} = require("../services/session.service");
const { validatePassword, findUser } = require("../services/user.service");
const { signJWT } = require("../utils/jwt.utils");
const _ = require("lodash");

const catchAsyncError = require("../utils/catchAsyncErrors");
const AppError = require("../utils/appErrorsClass");

class SessionController {
  /**
   * @description Login as a student or a doctor or an admin or a library
   * @route /api/v1/sessions/login
   * @method POST
   * @access public
   */
  static login = catchAsyncError(async (req, res, next) => {
    const { phone, password } = req.body;

    const [user, type] = await validatePassword(phone, password);
    if (!user) return next(new AppError("Invalid credentials", 401));

    if (type === "Student") {
      if (user.suspended.value)
        return next(new AppError("Account suspended", 401));

      const result = await checkExistingSession(user._id);

      if (result.status === "error")
        return next(new AppError("Error checking existing session", 500));

      const hasActiveSession = result;

      if (hasActiveSession)
        return next(new AppError("user has active session", 400));
    }

    const { status, data, message } = await createSession(
      type,
      user._id,
      req.get("user-agent") || ""
    );
    if (!status) return next(new AppError(message, 500));

    const accessToken = signJWT(
      { ...{ ...user, role: type }, session: data._id },
      process.env.accessTokenPrivateKey,
      { expiresIn: process.env.accessTokenTtl }
    );

    const refreshToken = signJWT(
      { ...{ ...user, role: type }, session: data._id },
      process.env.refreshTokenPrivateKey,
      { expiresIn: process.env.refreshTokenTtl }
    );

    return res.send({ role: type, object: user, accessToken, refreshToken });
  });

  /**
   * @description Logout
   * @route /api/v1/sessions/logout
   * @method DELETE
   * @access private
   */
  static logout = catchAsyncError(async (req, res, next) => {
    const sessionId = res.locals.user.session;

    const { status, message } = await deleteSession(sessionId);
    if (!status) return next(new AppError(message, 500));

    return res.send({
      accessToken: "",
      refreshToken: "",
    });
  });

  /**
   * @description Get the current logged in user data
   * @route /api/v1/sessions/me
   * @method Get
   * @access private
   */
  static getMe = catchAsyncError(async (req, res, next) => {
    const { _id, role } = res.locals.user;

    let { status, data, message } = await findUser(role, { _id });
    if (!status) return next(new AppError(message, 500));

    return res.send({ role, object: data });
  });
}

module.exports = SessionController;
