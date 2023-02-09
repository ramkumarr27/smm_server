const jwt = require("jsonwebtoken");
const User = require("../models/User");

const verifyEmailController = async (req, res) => {
  const { token } = req.query;
  if (!token) {
    res.status(404).send({ success: "false", message: "Invalid Token !" });
  }

  // decode the token

  let decodedToken;
  try {
    decodedToken = jwt.verify(token, process.env.secretkey);
  } catch (error) {
    res
      .status(400)
      .send({ success: "false", message: "Invalid Token !", error: error });
  }

  // checking if user is present or not
  const existingUser = await User.findOne({ email :  decodedToken.email });
  if (!existingUser) {
    return res.status(404).send({
      success: "false",
      message: "User is not found !",
    });
  }else{
    existingUser.verified = "true";
    await existingUser.save();
  }
  
  res
    .status(200)
    .send({ success: "true", message: "Email verfied successfully!!" });
};

module.exports = { verifyEmailController };
