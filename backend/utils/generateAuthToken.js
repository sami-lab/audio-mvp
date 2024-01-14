const jwt = require("jsonwebtoken");

function generateUserAuthToken(user) {
  const token = jwt.sign(
    {
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      username: user.username,
      email: user.email,
      role: user.role,
      isActive: user.isActive,
    },
    process.env.USER_JWT_PRIVATE_KEY
  );
  return token;
}

module.exports = {
  generateUserAuthToken,
};
