// models/User.js
const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
      minlength: [3, "Name must be at least 3 characters long"],
    },
    adhar: {
      type: String,
      required: [true, "Aadhar number is required"],
      match: [/^\d{4}-\d{4}-\d{4}$/, "Aadhar must be in the format XXXX-XXXX-XXXX"],
      unique: true,
    },
    age: {
      type: Number,
      required: [true, "Age is required"],
      min: [1, "Age must be at least 1"],
      max: [120, "Age must be less than 120"],
    },
    bloodGroup: {
      type: String,
      required: [true, "Blood group is required"],
      enum: {
        values: ["A+", "A-", "B+", "B-", "O+", "O-", "AB+", "AB-"],
        message: "Invalid blood group",
      },
    },
    gender: {
      type: String,
      required: [true, "Gender is required"],
      enum: {
        values: ["Male", "Female", "Other"],
        message: "Gender must be Male, Female, or Other",
      },
    },
    phone: {
      type: String,
      required: [true, "Phone number is required"],
      match: [/^\d{10}$/, "Phone number must be exactly 10 digits"],
    },
    relativePhone: {
      type: String,
      required: [true, "Relative's phone number is required"],
      match: [/^\d{10}$/, "Relative's phone must be exactly 10 digits"],
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      lowercase: true,
      unique: true,
      match: [/\S+@\S+\.\S+/, "Invalid email address"],
    },
    location: {
      type: String,
      required: [true, "Location is required"],
      trim: true,
    },
    photo: {
      type: String,
      default:
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTf81Xz8PDyOUJDptXJD-OlcXjgMI4KmLZF9Q&usqp=CAU",
    },
    role: {
      type: String,
      enum: {
        values: ["citizen", "member"],
        message: "Role must be either citizen or member",
      },
      default: "citizen",
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: [6, "Password must be at least 6 characters long"],
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);