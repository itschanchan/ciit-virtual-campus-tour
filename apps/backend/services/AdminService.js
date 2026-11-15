import Admin from "../models/Admins.js";

// function object
const AdminService = {
  // Actions:
  // getAdminDetails
  getAdminDetails: async (adminId) => {
    try {
      // -password: dash means exclude the password field from the result. This is a security measure to prevent sensitive information from being exposed.
      const admin = await Admin.findById(adminId).select("-password"); // instantiate admin

      // verification if the admin is existing or not
      if (!admin) {
        throw new Error("Admin not found.");
      }
      return admin;
    } catch (error) {
      throw new Error(`Error fetching data: ${error.message}`); // $ - string interpretation
    }
  },

  // createAdmin
  createAdmin: async (adminData) => {
    try {
      // check if the email or username already exists in the database
      // findOne() is a method provided by Mongoose that allows you to search for a single document in the database that matches the specified criteria. It returns the first document that matches the query or null if no matching document is found.
      const existingAdmin = await Admin.findOne({ email: adminData.email });
      if (existingAdmin) {
        throw new Error("Admin with this email already exists.");
      }

      // actual save
      const newAdmin = new Admin(adminData); // instantiate the admin model with the provided adminData
      await newAdmin.save();

      // response
      // ... - data destructuring, it allows you to extract the password field from the newAdmin object and create a new object called adminWithoutPassword that contains all the other fields except for password. This is a common practice to ensure that sensitive information like passwords is not included in the response sent back to the client.
      // toObject - creates a json file from the Mobngoose document.
      const { password, ...adminWithoutPassword } = newAdmin.toObject(); // toObject() is a method provided by Mongoose that converts a Mongoose document into a plain JavaScript object. This is useful when you want to manipulate the data or return it in a format that is more suitable for your application.
      return adminWithoutPassword;
    } catch (error) {
      throw new Error(`Error creating admin: ${error.message}`);
    }
  },

  // updateAdmin
  updateAdmin: async (adminId, updateData) => {
    try {
      // validation
      // 3 actions: find ID, update, return the updated admin.
      if (updateData.password) {
        throw new Error("Use changePassword service to update password.");
      }

      // previous iteration of code
      /*
      const updateAdmin = await Admin.findByIdAndUpdate(
        adminId,
        { $set: updateData },
        { new: true, runValidators: true },
      ).select("-password"); // method chaining

      if (!updateAdmin) {
        throw new Error("Admin not found.");
      }
      */

      const admin = await Admin.findById(adminId);
      if (!admin) {
        throw new Error("Admin not found.");
      }

      // console.log("Update Data:", updateData); // Debugging log

      Object.assign(admin, updateData); // Object mapping
      await admin.save();
      const { password, ...adminWithoutPassword } = admin.toObject();
      return adminWithoutPassword;

      // return updateAdmin;
    } catch (error) {
      throw new Error(`Error updating admin: ${error.message}`);
    }
  },

  // deleteAdmin
  deleteAdmin: async (adminId) => {
    try {
      const admin = await Admin.findById(adminId);
      if (!admin) {
        throw new Error("Admin not found.");
      }
      admin.is_active = false; // soft delete
      return true;
    } catch (error) {
      throw new Error(`Error deleting admin: ${error.message}`);
    }
  },

  // changePassword
  changePassword: async (adminId, currentPassword, newPassword) => {
    try {
      // checks if the admin exists.
      const admin = await Admin.findById(adminId);
      if (!admin) {
        throw new Error("Admin not found.");
      }

      // checks if the current password is correct.
      const isMatch = await admin.comparePassword(currentPassword);
      if (!isMatch) {
        throw new Error("Current password is incorrect.");
      }

      // hashes the new password and saves it to the database (database call).
      admin.password = newPassword;
      await admin.save();

      return true;
    } catch (error) {
      throw new Error(`Error changing password: ${error.message}`);
    }
  },
};

export default AdminService;
