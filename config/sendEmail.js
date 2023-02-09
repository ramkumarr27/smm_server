const nodemailer = require("nodemailer"); // for fake ethereal
const User = require("../models/User");

const transporter = nodemailer.createTransport({
  host: "smtp.ethereal.email",
  port: 587,
  auth: {
    user: "rita.willms@ethereal.email",
    pass: "ujZ54a6m3McZRy9zen",
  },
  tls: {
    rejectUnauthorized: false,
  },
});

// tls :{
//   rejectUnauthorized : false
// }
module.exports = {
  sendverificationEmail: async (senderAddress, link) => {
    let error = false;
    try {
      await transporter.sendMail({
        from: '"ramkumar" <ramkumar@example.com>', // sender address
        to: senderAddress, // list of receivers
        subject: "Verfication Email", // Subject line
        html: `Please verify your Email by Clicking <a href = "${link}">here </a> <br/>
                This link will be valid only for 7 days!`, // html body
      });
    } catch (e) {
      console.log(e);
      error = true;
    }
    return error;
  },
  sendforgotpasswordEmail: async (senderAddress, link) => {
    let error = false;
    try {
      await transporter.sendMail({
        from: '"ramkumar" <ramkumar@example.com>', // sender address
        to: senderAddress, // list of receivers
        subject: "Reset Password", // Subject line
        html: `Please Reset your Password by Clicking <a href = "${link}">here </a> <br/>
              This link will be valid only for 7 days!`, // html body
      });
    } catch (e) {
      console.log(e);
      error = true;
    }
    return error;
  },
};
