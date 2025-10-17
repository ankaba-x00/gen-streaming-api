const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema(
  {
    name: { 
      type: String,
      trim: true,
      match: [/^[A-Za-z]+(?:\s+[A-Za-z]+)+$/, "Name may only contain letters and spaces and must contain 2 or more words"],
      required: [true, "Full name is required"],
      unique: true
    },
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
      unique: true
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
    gender: {
      type: String,
      enum: ["male", "female", "other"],
      required: [true, "Gender is required"]
    },
    storageHash: {
      type: String, 
      required: [true, "Storage hash is required for objects containing all media files"],
      unique: true 
    },
    country: {
      type: String,
      required: [true, "Country of residence is required"]
    },
    imgProfile: { 
      type: String, 
      defaut: "",
      required: false
    },
    phone: {
      type: String,
      trim: true,
      match: [/^\+[0-9]+$/, "Phone must start with + followed by only numbers"],
      required: false
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

module.exports = mongoose.model("User", UserSchema);