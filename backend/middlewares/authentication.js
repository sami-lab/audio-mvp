const jwt = require("jsonwebtoken");
const { Roles } = require("../models");

module.exports = async (req, res, next) => {
  const token = req.header("x-auth-token");

  if (!token) {
    console.warn("Access denied. No token provided");
    return res.status(401).json({ error: "Access denied. No token provided" });
  }

  try {
    const decoded = jwt.verify(token, process.env.USER_JWT_PRIVATE_KEY);

    if (req.header("x-auth-token") && !decoded.isActive) {
      console.warn("User is not active");
      return res.status(401).json({ error: "User is not active" });
    }

    const role = await Roles.findByPk(decoded.role);

    req.user = {
      ...decoded,
      roles: [role.name],
    };
    next();
  } catch (ex) {
    console.warn(`Invalid Token: ${ex}`);
    res.status(422).json({ error: "Invalid token" });
  }
};
