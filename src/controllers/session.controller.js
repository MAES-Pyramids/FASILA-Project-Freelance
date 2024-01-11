const { signJWT } = require("../utils/jwt.utils");
const { validatePassword } = require("../services/user.service");
const {
  createSession,
  deleteSession,
  checkExistingSession,
} = require("../services/session.service");

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

    // Validate the user's password
    const [user, type] = await validatePassword(phone, password);
    if (!user) return next(new AppError("Invalid credentials", 401));

    // ensure no active session for student
    if (type === "Student") {
      if (await checkExistingSession(user._id))
        return next(new AppError("user has active session", 400));
    }

    // create a session
    const session = await createSession(
      type,
      user._id,
      req.get("user-agent") || ""
    );

    // create an access token
    const accessToken = signJWT(
      { ...{ ...user, rol: type }, session: session._id },
      process.env.accessTokenPrivateKey,
      { expiresIn: process.env.accessTokenTtl }
    );

    // create a refresh token
    const refreshToken = signJWT(
      { ...{ ...user, rol: type }, session: session._id },
      process.env.refreshTokenPrivateKey,
      { expiresIn: process.env.refreshTokenTtl }
    );

    // return access & refresh tokens
    // TODO: we still need to set cookies in the browser and check for the best way and what is the path used for
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

    await deleteSession(sessionId);

    return res.send({
      accessToken: "",
      refreshToken: "",
    });
  });
}

module.exports = SessionController;
