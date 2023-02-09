const bcrypt = require("bcrypt");
const User = require("../models/User");
const tokenGenerator = require("../config/token");
const {
  sendverificationEmail,
  sendforgotpasswordEmail,
} = require("../config/sendEmail");

const registerController = async (req, res) => {
  const payload = req.body;
  const { name, email, password } = req.body;

  //checking all fields
  if (!name || !email || !password) {
    return res.status(400).send({
      success: "false",
      message: "Please fill in all fields !",
    });
  }

  //   if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email)) {
  //     return res.status(400).send({
  //       success: "false",
  //       message: "Please enter valid email !",
  //     });
  //   }
  // checking password length
  if (password.length < 8) {
    return res.status(400).send({
      success: "false",
      message: "Password should be atleast 8 characters !",
    });
  }
  // checking  and regsiteration
  const existingUser = await User.findOne({ email });
  if (!existingUser) {
    payload.password = await bcrypt.hash(password, 10);

    const newUser = new User(payload);
    await newUser.save(async (err, data) => {
      if (err) {
        return res.status(400).send({
          success: "false",
          message: err,
        });
      }
      if (data) {
        const token = tokenGenerator({ email: newUser.email });
        const link =  "http://"+ req.hostname +":3000/verifyEmail/?token=" + token;
        const sendEmail = await sendverificationEmail(newUser.email, link);
        if (sendEmail) {
          res.status(200).send({
            success: "true",
            message:
              "Registeration successfull.! Error in sending verification email !",
          });
        } else {
          res
            .status(200)
            .send({ success: "true", message: "Registeration successfull, Kindly complete the verification !!" });
        }
      }
    });
  } else {
    return res.status(403).send({
      success: "false",
      message: "User has been already exists !",
    });
  }
};

const loginController = async (req, res) => {
  const { email, password } = req.body;

  //checking all fields
  if (!email || !password) {
    return res.status(400).send({
      success: "false",
      message: "Please fill in all fields !",
    });
  }
// findling old user
  const existingUser = await User.findOne({ email: email });
  if (!existingUser) {
    return res.status(400).send({
      success: "false",
      message: "Invalid Email/Password !",
    });
  }
//Comparing password
  const validUser = await bcrypt.compare(password, existingUser.password);
  if (!validUser) {
    return res.status(400).send({
      success: "false",
      message: "Invalid Email/Password !",
    });
  }

  //generate token with user info
  const token = tokenGenerator({
    email: existingUser.email,
    name : existingUser.name,
    verified : existingUser.verified,
    _id: existingUser._id,
  });
  //sending response
  res.status(200).send({
    success: "true",
    token,
    message: "Logged in successfull !",
  });
};

const forgotpasswordController = async (req, res) => {
  const { email } = req.body;
  if (!email) {
    return res.status(400).send({
      success: "false",
      message: "Enter valid email !",
    });
  }

  const oldUser = User.findOne({ email });
  if (!oldUser) {
    return res.status(404).send({
      success: "false",
      message: "User is not found !",
    });
  } else {
    //console.log({email: oldUser._conditions.email});
   
   //generate token
    const token = tokenGenerator({ email: oldUser._conditions.email });
    const link =
      "http://" + req.hostname + ":3000/resetpassword?token=" + token; // sepearte authetication
    const sendEmail = await sendforgotpasswordEmail(
      oldUser._conditions.email,
      link
    );
    if (sendEmail) {
      res.status(201).send({
        success: "true",
        message: " Error in sending email !",
      });
    } else {
      res.status(200).send({ success: "true", message: "Email sent !!" });
    }
  }
};

const resetPasswordController = async (req, res) => {
  const { email, newPassword, confirmNewPassword } = req.body;

  //checking all fields
  if (!newPassword || !email || !confirmNewPassword) {
    return res.status(400).send({
      success: "false",
      message: "Please fill in all fields !",
    });
  }


  //checking both passwords are matching
  if (newPassword !== confirmNewPassword) {
    return res.status(404).send({
      success: "false",
      message: "Password does not match",
    });
  }

  // Checking the user is valid
  const existingUser = await User.findOne({ email });
  if (!existingUser) {
    return res.status(404).send({
      success: "false",
      message: "User is not found !",
    });
  } else {
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    const updatedData = await User.findOneAndUpdate(
      { email },
      {
        $set: {
          password: hashedPassword,
        },
      }
    );

    if (updatedData) {
      res
        .status(200)
        .send({ success: true, message: "Passsword updated successfully !" });
    } else {
      return res.status(500).send({
        success: "false",
        message: "Something went wrong !",
      });
    }
  }
};

module.exports = {
  registerController,
  loginController,
  forgotpasswordController,
  resetPasswordController,
};
