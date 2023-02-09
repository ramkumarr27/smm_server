const jwt = require("jsonwebtoken");

module.exports = (data) => {
  const token = jwt.sign(data, process.env.secretkey, { expiresIn: "7d" });
  return token;
};
