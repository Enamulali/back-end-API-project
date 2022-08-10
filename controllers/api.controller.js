const json = require("../endpoints.json");

exports.healthCheck = (req, res, next) => {
  res.status(200).send("Health check");
};

exports.getAPI = (req, res, next) => {
  res.status(200).send(json);
};
