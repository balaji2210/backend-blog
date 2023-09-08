module.exports.responseHandler = (res, message = "Success", data = null) => {
  return res.status(200).json({
    message,
    data,
  });
};

module.exports.errorHandler = (res, message = "", status = 400) => {
  return res.status(status).json({
    message,
  });
};

module.exports.catchHandler = (res, req, error) => {
  let errorMsg = error;
  const joiError = error[Object?.keys(error)?.[1]]?.[0]?.message;

  if (joiError) {
    errorMsg = joiError;
  }

  const errorAPI = `${req.method}: ${req.originalUrl}`;
  return res.status(500).json({
    errorAPI,
    errorMsg: error,
  });
};
