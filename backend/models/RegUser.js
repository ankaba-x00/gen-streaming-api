const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema(
  {
    username: { 
      type: String,
      trim: true,
      match: [/^[A-Za-z0-9_-]+$/, "Username may only contain letters, numbers, spaces, and _ or -"],
      required: [true, "Username is required"],
      unique: true
    },
    email: { 
      type: String,
      lowercase: true,
      trim: true,
      match: [/^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/, "Email address allows letters, numbers, dot, underscore, percent, plus and hyphen before @ and requires a TLD of 2 or more letters"],
      required: [true, "Email is required"],
    },
    password: { 
      type: String, 
      minlength: [8, "Password must be at least 8 characters long"],
      match: [
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).+$/,
        "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character"
      ],
      required: [true, "Password is required"],
    },
    isAdmin: { 
      type: Boolean,
      default: false,
      required: [true, "Admin status is required"] 
    },
    isActive: { 
      type: Boolean, 
      default: true,
      required: [true, "Active status is required"]
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("RegUser", UserSchema);