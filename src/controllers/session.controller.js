const { signJWT } = require("../utils/jwt.utils");
const { validatePassword } = require("../services/user.service");
const { createSession } = require("../services/session.service");

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

    // ensure there is no active session for this user

    // create a session
    const session = await createSession(
      type,
      user._id,
      req.get("user-agent") || ""
    );

    // create an access token
    const accessToken = signJWT(
      { ...user, session: session._id },
      process.env.accessTokenPrivateKey,
      { expiresIn: process.env.accessTokenTtl }
    );

    // create a refresh token
    const refreshToken = signJWT(
      { ...user, session: session._id },
      process.env.refreshTokenPrivateKey,
      { expiresIn: process.env.refreshTokenTtl }
    );
    // return access & refresh tokens
    // TODO: we still need to set cookies in the browser and check for the best way and what is the path used for
    return res.send({ role: type, accessToken, refreshToken });
  });
}

module.exports = SessionController;
