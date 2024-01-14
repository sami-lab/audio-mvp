const appError = require("../utils/appError");
const handleCastError = (err) => {
  const message = `Invalid ${err.path} : ${err.value}`;
  return new appError(message, 400);
};
const handleDuplicate = (err) => {
  let value = err.parent.detail.split("=")[0];
  const message = `Duplicate Field value: ${value}.Please Use another Value`;
  return new appError(message, 400);
};
const HandleValidationError = (err) => {
  const errors = Object.values(err.errors).map((el) => el.message);
  const message = `Invalid Input Data ${errors.join(". ")}`;
  return new appError(message, 400);
};

const sendErrDev = (err, res) => {
  res.status(err.statusCode).json({
    status: err.status,
    error: err,
    message: err.message,
    stack: err.stack,
  });
};
const sendErrProd = (err, res) => {
  //trusted Error Send Message To Client
  if (err.Operational) {
    res.status(err.statusCode).json({
      success: false,
      status: err.status,
      message: err.message,
    });
  } else {
    //Programming Or Other Unknown Error
    console.error("Error ", err);
    res.status(500).json({
      success: false,
      status: err.status,
      message: "Something Went Wrong",
    });
  }
};

//This is root function of our middleware here we decide if enviroment is development
//then we send detail response else we only send general message relared to error
module.exports = (err, req, res, next) => {
  //console.error('Error test', err);
  err.statusCode = err.statusCode || 500;
  err.status = err.status || "error";

  if (process.env.NODE_ENV === "development") {
    //preparing development errors
    sendErrDev(err, res);
  } else {
    let error = err;
    //we know some errors type based on which we preapare genral message for client

    //In case client send wrong types handleCastError() method will send general error message
    if (error.name === "CastError") error = handleCastError(error);
    //In case client break any Constraint like unique Constraint(unique value of system name) handleDuplicate() method will send general error message
    if (err.name === "SequelizeUniqueConstraintError")
      error = handleDuplicate(error);
    //In case client send invalid data HandleValidationError() method will send general error message
    if (error.name === "ValidationError") error = HandleValidationError(error);
    //preparing production  errors
    sendErrProd(error, res);
  }
};
