import jwt from "jsonwebtoken";
import Admin from "../models/Admins.js";

const authService = {
  login: async (username, password) => {
    try {
      // Find admin by username
      const admin = await Admin.findOne({ username });
      if (!admin) {
        throw new Error("Invalid username.");
      }

      // Use the comparePassword method defined on the Admin model
      const isMatch = await admin.comparePassword(password);
      if (!isMatch) {
        throw new Error("Invalid password.");
      }

      const accessToken = jwt.sign(
        { adminId: admin._id, username: admin.username, role: admin.role },
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: "15m" },
      );

      // Generate a long-lived refresh token (7 days)
      const refreshToken = jwt.sign(
        { adminId: admin._id },
        process.env.REFRESH_TOKEN_SECRET,
        { expiresIn: "7d" },
      );

      return {
        accessToken,
        refreshToken,
        user: {
          id: admin._id,
          username: admin.username,
          email: admin.email,
          role: admin.role,
        },
      };
    } catch (error) {
      throw new Error(`Error during login: ${error.message}`);
    }
  },

  register: async (adminData) => {
    try {
      // The Admin model's pre-save hook will hash the password automatically
      const admin = new Admin(adminData);
      await admin.save();
      const { password, ...adminWithoutPassword } = admin.toObject();
      return adminWithoutPassword;
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

      // Make sure the admin still exists
      const admin = await Admin.findById(decoded.adminId);
      if (!admin) {
        throw new Error("Admin not found.");
      }

      const newAccessToken = jwt.sign(
        { adminId: admin._id, username: admin.username, role: admin.role },
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: "15m" },
      );

      return { accessToken: newAccessToken };
    } catch (error) {
      throw new Error("Invalid or expired refresh token");
    }
  },

  // Called by GET /api/admin/session to restore the logged-in admin
  getSessionUser: async (refreshToken) => {
    const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
    const admin = await Admin.findById(decoded.adminId);

    if (!admin) {
      throw new Error("Admin not found.");
    }

    return {
      id: admin._id,
      username: admin.username,
      email: admin.email,
      role: admin.role,
    };
  },

  logout: async () => {
    // Stateless logout - the controller will clear the httpOnly cookie.
    // Nothing to do on the service side unless you store tokens in a DB.
  },
};

export default authService;
