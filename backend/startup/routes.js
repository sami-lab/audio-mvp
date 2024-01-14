const express = require("express");
const AppError = require("../utils/appError");

//define all error type to send meaningfull response to client
const globalError = require("../controllers/errorController");

const user = require("../routes/user.route");
const userAuth = require("../routes/userAuth.route");

module.exports = (app) => {
  app.use(express.json());
  app.use("/api/auth", userAuth);
  app.use("/api/user", user);

  //In case client call any route which is not defined above we will send not found response
  app.all("*", (req, res, next) => {
    next(
      new AppError(
        `requested Url ${req.originalUrl} could not be found on this server`,
        404
      )
    );
  });
  app.use(globalError);
};
