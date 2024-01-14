module.exports = (req, res, next) => {
  // console.log("req.user", req.user);
  const isAdmin =
    req.user.roles &&
    (req.user.roles.includes("Moderator") || req.user.roles.includes("Admin"));

  if (!isAdmin) {
    console.warn("Access denied. This action is reserved for admins");
    return res
      .status(401)
      .json({ error: "Access denied. This action is reserved for admins" });
  }

  next();
};
