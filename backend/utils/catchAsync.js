//this function is high level function which catch errors
//with this we dont need to deine try and catch in every controller method we just wrap method with this function and in case
// error occur it catch that error and call next() middleware which will prepare error message for client
module.exports = (fn) => {
  return (req, res, next) => {
    fn(req, res, next).catch(next);
  };
};
