const mongoose = require("mongoose"); // ORM - object relational mapping // Connector

// const connect = () => {
//   mongoose.connect(process.env.MONGO_URI, {}, (err) => {
//     if (err) throw err;
//     console.log("DB Connected successfully..!");
//   });
// };

// module.exports = connect;

exports.dbConnect = () => {
  mongoose.connect(`${process.env.MONGO_URI}`)
    .then(() => {
      console.log("DB Connection established...");
    })
    .catch((err) => {
      console.log(err);
    });
};
