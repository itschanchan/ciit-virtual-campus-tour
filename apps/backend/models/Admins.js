import mongoose from 'mongoose';
import bcrypt from 'bcrypt';

// Database schema for the admin collection

const AdminSchema = new mongoose.Schema(
  {
    username: { type: String, required: true, unique: true, trim: true, lowercase: true },
    email: { type: String, required: true, unique: true, trim: true, lowercase: true },
    password: { type: String, required: true },
    first_name: { type: String, required: true },
    last_name: { type: String, required: true },
    date_of_birth: { type: Date, required: true },
    address: { type: String, required: true },
    contact_number: { type: String, required: true },
    is_active: { type: Boolean, default: true },
  },
  {
    timestamps: true, // automatically adds createdAt and updatedAt fields
  },
);

// Middleware

AdminSchema.pre('save', async function () {
  // Hashing the password
  if (this.isModified('password')) {
    // 10 is the salt rounds, which determines the computational cost of hashing.
    // 10 is the sweet spot for salt rounds.
    // async and await is always a pair. You cannot use async without await and vice versa.
    this.password = await bcrypt.hash(this.password, 10);
  }
});

AdminSchema.methods.comparePassword = async function (candidatePassword) {
  // 1st param - clear text
  // 2nd param - hashed password from database
  return await bcrypt.compare(candidatePassword, this.password);
};

// the other file should read this file as a model, it indicates that this is connected to the database.
export const Admin = mongoose.models.Admin || mongoose.model('Admin', AdminSchema);

export default Admin;
