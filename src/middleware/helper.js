const jwt = require("jsonwebtoken");
const User = require("../models/User.js");

const NOT_AUTHORIZED = "Not authorized";
const NOT_AUTHORIZED_NO_TOKEN = "Not authorized, tokenLESS";

async function getUser(req) {
  if (
    // Authorization word is key sensivite as is in postman
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      const token = req.headers.authorization.split(" ")[1];
      if (!token && req.cookies.token) token=req.cookies.token
      if (!token) return {status:401,response:NOT_AUTHORIZED_NO_TOKEN}

      const decoded = jwt.verify(token, process.env.JWT_SALT);
      const user = await User.findById(decoded.id).select("-password");
      return { status: 200, response: user };
    } catch (error) {
      console.log(error);
      return { status: 401, response: NOT_AUTHORIZED };
    }
  }
  return { status: 401, response: NOT_AUTHORIZED };
}
module.exports = { getUser, notAuthorizedMessage: NOT_AUTHORIZED };
