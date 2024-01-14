const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");

const bcrypt = require("bcrypt");
const { Op } = require("sequelize");
const { User } = require("../models");
const { Roles } = require("../models");
const { validateUser } = require("../utils/validations");

const { generateUserAuthToken } = require("../utils/generateAuthToken");

exports.createDefaultRoles = async (defaultRoles) => {
  const roles = await Roles.findAll({});
  if (roles.length > 0) {
    console.log("Roles already exist");
    return true;
  }
  let doc = await Roles.bulkCreate(
    defaultRoles.map((r) => [
      {
        name: r,
      },
    ])
  );
  if (doc.length > 0) {
    console.log("Default Roles created");
    return true;
  }
  return false;
};
exports.createAdmin = async () => {
  try {
    let firstName = process.env.ADMIN_FIRSTNAME;
    let lastName = process.env.ADMIN_LASTNAME;
    let username = process.env.ADMIN_USERNAME;
    let email = process.env.ADMIN_EMAIL;
    let password = process.env.ADMIN_PASSWORD;

    let role = await Roles.findOne({
      where: {
        name: "Admin",
      },
    });
    if (!role) {
      return false;
    }
    let userObj = {
      firstName,
      lastName,
      username,
      email,
      password,
      role: role.id,
    };
    const { error } = validateUser(userObj);

    if (error) {
      console.warn(`Invalid data format: ${error}`);
      return false;
    }

    const user = await User.findOne({
      where: {
        [Op.or]: [{ username: username }, { email: email }],
      },
    });

    if (user) {
      console.warn("Admin already registered");
      return true;
    }

    const salt = await bcrypt.genSalt(10);
    userObj.password = await bcrypt.hash(userObj.password, salt);

    const newUser = await User.create(userObj);
    const sanitizedUser = { ...newUser.get() };
    delete sanitizedUser.password;
    return true;
  } catch (error) {
    console.error("Error creating user:", error);
    return false;
  }
};
exports.getAllUsers = catchAsync(async (req, res, next) => {
  const users = await User.findAll({
    attributes: {
      exclude: ["password"],
    },
    include: [
      {
        model: Roles,
        as: "roles", //Find no of Tables
        attributes: ["name"],
      },
    ],
  });
  // Transform the result to have roles as an array of names
  const modifiedUsers = users.map((user) => {
    const roles = [user.roles.name];
    return {
      ...user.toJSON(), // Get the user object as JSON
      roles, // Add roles as an array of names
    };
  });
  if (!users) {
    console.warn("No Users found");
    return next(new AppError("User not found", 404));
  }

  res.status(200).json({
    success: true,
    data: {
      doc: modifiedUsers,
    },
  });
});

exports.getMyUser = catchAsync(async (req, res, next) => {
  const user = await User.findByPk(req.user.id);

  if (!user) {
    console.warn("User not found");
    return next(new AppError("User not found", 404));
  }

  const sanitizedUser = { ...user.get() };
  delete sanitizedUser.password;

  res.status(200).json({
    success: true,
    data: {
      doc: sanitizedUser,
    },
  });
});

exports.updateUser = catchAsync(async (req, res, next) => {
  const user = await User.findByPk(req.user.id);
  if (!user) {
    console.warn("User not found");
    return next(new AppError("User not found", 404));
  }
  await user.update({
    name: req.body.name,
    bio: req.body.bio,
  });
  const sanitizedUser = { ...user.get() };
  delete sanitizedUser.password;
  res.status(200).json({
    success: true,
    data: {
      doc: sanitizedUser,
    },
  });
});

exports.deleteUser = catchAsync(async (req, res, next) => {
  const user = await User.findByPk(req.user.id);
  if (!user) {
    console.warn("User not found");
    return next(new AppError("User not found", 404));
  }
  await user.destroy();
  res.status(204).json({
    success: true,
  });
});
