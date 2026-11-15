import authService from "../services/AuthService.js";

const authController = {
  // POST /api/admin/login
  login: async (req, res) => {
    try {
      const { username, password } = req.body;
      const { accessToken, refreshToken, user } = await authService.login(
        username,
        password,
      );

      // SETS COOKIES
      // Store the refresh token in an httpOnly cookie so JavaScript cannot read it
      // This protects against XSS attacks
      res.cookie("refreshToken", refreshToken, {
        httpOnly: true, // JS cannot access this cookie
        secure: process.env.NODE_ENV === "production", // HTTPS only in production
        sameSite: "strict",
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days in milliseconds
      });

      // Return the short-lived access token in the response body
      // The client stores this in memory (React state), NOT in localStorage
      res.status(200).json({
        status: "success",
        message: "Login successful",
        accessToken,
        user,
      });
    } catch (error) {
      res.status(401).json({
        error: { code: "INVALID_CREDENTIALS", message: error.message },
      });
    }
  },

  // GET /api/admin/session
  session: async (req, res) => {
    try {
      const refreshToken = req.cookies.refreshToken;
      if (!refreshToken) {
        return res.status(401).json({ error: "No active session" });
      }

      const user = await authService.getSessionUser(refreshToken);
      res.status(200).json({ user });
    } catch (error) {
      res.status(401).json({ error: "Invalid session" });
    }
  },

  // POST /api/admin/register
  register: async (req, res) => {
    try {
      const adminData = req.body;
      // FR-001.1a: Block admin registration via public endpoint; enforce author assignment by admin
      if (adminData.role === "admin") {
        return res.status(403).json({ error: "Admin registration is not allowed via public endpoint." });
      }
      adminData.role = "admin";
      const admin = await authService.register(adminData);
      res.status(201).json({
        status: "success",
        message: "Admin registered successfully",
        data: admin,
      });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  },

  // POST /api/admin/refresh
  // The browser automatically sends the httpOnly refreshToken cookie with this request
  refresh: async (req, res) => {
    try {
      const refreshToken = req.cookies.refreshToken;
      if (!refreshToken) {
        return res.status(401).json({ error: "No refresh token procided" });
      }

      const { accessToken } =
        await authService.refreshAccessToken(refreshToken);

      res.status(200).json({
        status: "success",
        accessToken,
      });
    } catch (error) {
      res.status(401).json({ error: error.message });
    }
  },

  // POST /api/admin/logout
  logout: async (req, res) => {
    try {
      // await authService.logout();
      // Clear the httpOnly refresh token cookie
      res.clearCookie("refreshToken", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
      });
      res.status(200).json({ status: "success", message: "Logout successful" });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },
};

export default authController;
