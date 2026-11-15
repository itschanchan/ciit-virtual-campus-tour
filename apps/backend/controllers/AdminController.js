import adminService from "../services/AdminService.js";

/* 
  Actions

  NOTES:
    req - request object
    res - response object
*/

const adminController = {
  getMyProfile: async (req, res) => {
    try {
      const adminId = req.admin.adminId;
      const admin = await adminService.getAdminDetails(adminId);
      res.status(200).json({ status: "success", data: admin });
    } catch (error) {
      res.status(500).json({ status: "error", message: error.message });
    }
  },

  getAdminDetails: async (req, res) => {
    try {
      const adminId = req.params.id; // http://localhost:3000/api/admins/1
      /*
        http://localhost:3000 - base url
        /api - prefix
        /admins - endpoint
        /1 - parameter
      */
      const admin = await adminService.getAdminDetails(adminId);
      res.status(200).json({ status: "success", data: admin }); // json payload
    } catch (error) {
      res.status(500).json({ status: "error", message: error.message });
    }
  },

  createAdmin: async (req, res) => {
    try {
      const adminData = req.body;
      const admin = await adminService.createAdmin(adminData);
      res.status(201).json({ status: "success", data: admin });
    } catch (error) {
      res.status(500).json({ status: "error", message: error.message });
    }
  },

  updateAdmin: async (req, res) => {
    try {
      const adminId = req.params.id;
      const updateData = req.body;
      const updatedAdmin = await adminService.updateAdmin(adminId, updateData);
      res.status(200).json({ status: "success", data: updatedAdmin });
    } catch (error) {
      res.status(500).json({ status: "error", message: error.message });
    }
  },

  deleteAdmin: async (req, res) => {
    try {
      const adminId = req.params.id;
      await adminService.deleteAdmin(adminId);
      res
        .status(200)
        .json({ status: "success", message: "Admin deleted successfully." });
    } catch (error) {
      res.status(500).json({ status: "error", message: error.message });
    }
  },

  changePassword: async (req, res) => {
    try {
      const adminId = req.params.id;
      const currentPassword = req.body.currentPassword;
      const newPassword = req.body.newPassword;

      await adminService.changePassword(adminId, currentPassword, newPassword);
      res
        .status(200)
        .json({ status: "success", message: "Password changed successfully." });
    } catch (error) {
      res.status(500).json({ status: "error", message: error.message });
    }
  },
};

export default adminController;
