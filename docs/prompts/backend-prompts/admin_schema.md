# Admin Mongoose Schema

```js
import mongoose from "mongoose";
import bcrypt from "bcrypt";

// Database schema for the user collection

const UserSchema = new mongoose.Schema(
  {
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    first_name: { type: String },
    last_name: { type: String },
    date_of_birth: { type: Date },
    address: { type: String },
    contact: { type: String, required: true },
    role: {
      type: String,
      enum: ["admin", "author", "user"],
      default: "user",
    },
    is_active: { type: Boolean, default: true },
  },
  {
    timestamps: true, // automatically adds createdAt and updatedAt fields
  },
);

// Middleware

/* 
    NOTES:
    - next: indicates the next middleware function in the stack. It is a callback function that you call when your middleware is done processing.
    - there's some programming languages have already a built-in next() function.
    - this: refers to the current document being saved (UserSchema itself)
*/
UserSchema.pre("save", async function () {
  //   if (!this.isModified("password")) return next();
  if (this.isModified("password")) {
    // install bcryptjs package to hash the password `npm install bcrypt`
    // 10 is the salt rounds, which determines the computational cost of hashing. Higher values are more secure but take longer to compute.
    // 10 is the sweet spot for salt rounds.
    // async and await is always a pair. You cannot use async without await and vice versa.
    this.password = await bcrypt.hash(this.password, 10);
  }
  /* 
  NOTE: No need to put "next()" since Mongoose will automatically 
  proceed to the next middleware or save the document after this function completes.

  else {
    return next();
  }
  */
});

UserSchema.methods.comparePassword = async function (candidatePassword) {
  // 1st param - clear text
  // 2nd para - hashed password from database
  return await bcrypt.compare(candidatePassword, this.password);
};

// the other file should read this file as a model, it indicates that this is connected to the database.
export default mongoose.model("User", UserSchema);
```