import jwt from "jsonwebtoken";

// This middleware protects routes that require a logged-in user.
// It expects the clietn to send the access token in the Authorization header;
// Authorization: Bearer <accessToken>
const verifyToken = (req, res, next) => {
  // Read the Authorization header
  const authHeader = req.headers["authorization"];

  // The header looks like: "Bearer eyJhbGc..."
  // We split on the space and take the second part (the actual token)
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).json({ error: "Access token required" });
  }

  try {
    // jwt.verift throws if the token is expired or has a bad signature
    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

    // Attach the decoded payload (userId, username) to req so controllers can use it
    req.user = decoded;

    next(); // move on to the controller
  } catch (error) {
    return res.status(401).json({ error: "Invalid or expired access token" });
  }
};

export default verifyToken;
