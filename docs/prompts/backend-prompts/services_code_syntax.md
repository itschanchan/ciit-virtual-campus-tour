# Services Layer Code Syntax

```js
import jwt from "jsonwebtoken";
import User from "../models/User.js";

const authService = {
  login: async (username, password) => {
    try {
      // Find user by username
      const user = await User.findOne({ username });
      if (!user) {
        throw new Error("Invalid username.");
      }

      // Use the comparePassword method defined on the User model
      const isMatch = await user.comparePassword(password);
      if (!isMatch) {
        throw new Error("Invalid password.");
      }

      const accessToken = jwt.sign(
        { userId: user._id, username: user.username, role: user.role },
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: "15m" },
      );

      // Generate a long-lived refresh token (7 days)
      const refreshToken = jwt.sign(
        { userId: user._id },
        process.env.REFRESH_TOKEN_SECRET,
        { expiresIn: "7d" },
      );

      return { accessToken, refreshToken };
    } catch (error) {
      throw new Error(`Error during login: ${error.message}`);
    }
  },

  register: async (userData) => {
    try {
      // The User model's pre-save hook will hash the password automatically
      const user = new User(userData);
      await user.save();
      const { password, ...userWithoutPassword } = user.toObject();
      return userWithoutPassword;
    } catch (error) {
      throw new Error(error.message);
    }
  },

  // Called when the client sends its refresh token cookie to get a new access token
  refreshAccessToken: async (refreshToken) => {
    try {
      // Verify the refresh token - throws if expired or tampered
      const decoded = jwt.verify(
        refreshToken,
        process.env.REFRESH_TOKEN_SECRET,
      );

      // Make sure the user still exists
      const user = await User.findById(decoded.userId);
      if (!user) {
        throw new Error("User not found.");
      }

      const newAccessToken = jwt.sign(
        { userId: user._id, username: user.username, role: user.role },
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: "15m" },
      );

      return { accessToken: newAccessToken };
    } catch (error) {
      throw new Error("Invalid or expired refresh token");
    }
  },

  logout: async () => {
    // Stateless logout - the controller will clear the httpOnly cookie.
    // Nothing to do on the service side unless you store tokens in a DB.
  },
};

export default authService;


```