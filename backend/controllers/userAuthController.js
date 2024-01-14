const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");

const bcrypt = require("bcrypt");
const { Op } = require("sequelize");

const { User } = require("../models");
const { Roles } = require("../models");
const { validateUserAuth, validateUser } = require("../utils/validations");
const { generateUserAuthToken } = require("../utils/generateAuthToken");
const { OAuth2Client } = require("google-auth-library");
const client = new OAuth2Client(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  process.env.GOOGLE_REDIRECT_URI
);

exports.login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;
  const { error } = validateUserAuth(req.body);

  if (error) {
    console.warn(`Invalid data format: ${error}`);
    return next(new AppError(`Invalid data format: ${error}`, 422));
  }

  const user = await User.findOne({
    where: {
      [Op.or]: [{ userName: email }, { email: email }],
    },
    include: [
      {
        model: Roles,
        as: "roles", //Find no of Tables
      },
    ],
  });
  if (!user) {
    // console.warn("Invalid username/email or password");

    return next(new AppError("Invalid username/email or password", 401));
  }

  if (!user.isActive) {
    console.warn("Inactive user");
    return next(new AppError("Inactive user", 401));
  }

  const validPassword = await bcrypt.compare(password, user.password);

  if (!validPassword) {
    console.warn("Invalid username/email or password");
    return next(new AppError("Invalid username/email or password", 401));
  }

  const token = generateUserAuthToken(user);

  res
    .status(200)
    .header("x-auth-token", token)
    .json({
      success: true,
      message: "Login Successful!",
      user: {
        id: user.id,
        name: user.name,
        bio: user.bio,
        userName: user.userName,
        email: user.email,
        roles: [user.roles.name],
      },
      jwt: token,
    });
});
exports.signup = catchAsync(async (req, res, next) => {
  const { name, userName, email, password } = req.body;
  let role = await Roles.findOne({
    where: {
      name: "Creator",
    },
  });
  if (!role) {
    return next(new AppError("Application is not ready to signup", 500));
  }
  let userObj = {
    name,
    userName,
    email,
    password,
    role: role.id,
  };
  const { error } = validateUser(userObj);

  if (error) {
    console.warn(`Invalid data format: ${error}`);
    return next(new AppError(`Invalid data format: ${error}`, 422));
  }
  const user = await User.findOne({
    where: {
      [Op.or]: [{ userName: userName }, { email: email }],
    },
  });

  if (user) {
    console.warn("User already registered");
    return next(new AppError("User already registered", 409));
  }
  const salt = await bcrypt.genSalt(10);
  userObj.password = await bcrypt.hash(password, salt);

  const newUser = await User.create(userObj);
  const sanitizedUser = { ...newUser.get() };
  delete sanitizedUser.password;

  res
    .status(200)
    .json({ success: true, message: "User was registered successfully!" });
});
exports.externalLogin = catchAsync(async (req, res, next) => {
  const { token, method } = req.body;

  let name = undefined;
  let email = undefined;
  if (method === "google") {
    let tokenFromCode = await client.getToken(token);
    let ticket = await client.verifyIdToken({
      idToken: tokenFromCode.tokens.id_token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });
    let u = ticket.getPayload();
    name = u.name;
    email = u.email;
  } else {
    return next(new AppError("Invalid data recieved from client", 422));
  }
  if (!name || !email)
    return next(new AppError("Invalid data recieved from client", 422));
  const user = await User.findOne({
    where: {
      [Op.or]: [{ userName: email }, { email: email }],
    },
    include: [
      {
        model: Roles,
        as: "roles", //Find no of Tables
      },
    ],
  });

  if (user) {
    if (!user.isActive) {
      console.warn("Inactive user");
      return next(new AppError("Inactive user", 401));
    }
    const token = generateUserAuthToken(user);
    res
      .status(200)
      .header("x-auth-token", token)
      .json({
        success: true,
        message: "Login Successful!",
        user: {
          id: user.id,
          name: user.name,
          bio: user.bio,
          userName: user.userName,
          email: user.email,
          roles: [user.roles.name],
        },
        jwt: token,
      });
  } else {
    let role = await Roles.findOne({
      where: {
        name: "Creator",
      },
    });
    if (!role) {
      return next(new AppError("Application is not ready to signup", 500));
    }
    let userObj = {
      name,
      userName: email,
      email,
      role: role.id,
    };
    const newUser = await User.create(userObj);
    const sanitizedUser = { ...newUser.get() };
    const token = generateUserAuthToken(sanitizedUser);
    res
      .status(200)
      .header("x-auth-token", token)
      .json({
        success: true,
        message: "Login Successful!",
        user: {
          id: sanitizedUser.id,
          name: sanitizedUser.name,
          bio: sanitizedUser.bio,
          userName: sanitizedUser.userName,
          email: sanitizedUser.email,
          roles: [role.name],
        },
        jwt: token,
      });
  }
});
