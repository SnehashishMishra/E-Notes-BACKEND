const jwt = require("jsonwebtoken");
const JWT_SECRET = "JWT$ecret$ignature"; // Secret key for JWT, should be stored in environment variables

const fetchuser = (req, res, next) => {
  // Get the user from the JWT token and add id to the request object
  const token = req.header("auth-token");
  if (!token) {
    return res
      .status(401)
      .send({ error: "Please authenticate using a valid token" });
  }
  try {
    const data = jwt.verify(token, JWT_SECRET); // Verify the token using the secret key and decode it
    req.user = data.user; // Attach the user data to the request object
  } catch (error) {
    return res
      .status(401)
      .send({ error: "Please authenticate using a valid token" });
  }
  next();
};
module.exports = fetchuser;
