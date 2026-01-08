const router = require("express").Router();
const User = require("../models/User");
const bcrypt = require("bcrypt");
const verify = require("../utils/verifyToken");
const generateStorageHash = require("../utils/generateHash");

//Create Admin
router.post("/", verify, async (req, res) => {
  if (req.user.role !== "ADMIN") {
    return res.status(403).json("Permission denied!");
  }

  try {
    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    const newUser = new User({
      username: req.body.username,
      email: req.body.email,
      password: hashedPassword,
      storageHash: req.body.storageHash ?? generateStorageHash(),
      role: req.body.role === "ADMIN" ? "ADMIN" : "USER",
      isActive: req.body.isActive,
      name: req.body.name,
      gender: req.body.gender,
      phone: req.body.phone,
      country: req.body.country,
      imgProfile: req.body.imgProfile,      
    });
    const savedUser = await newUser.save();
    const { password, ...info } = savedUser._doc;
    res.status(201).json(info);
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

//Update
router.put("/:id", verify, async (req, res) => {
  if (req.user.id !== req.params.id && req.user.role !== "ADMIN") {
    return res.status(403).json("You can update only your own account!");
  }

    try {
    const updateData = { ...req.body };
    if (req.user.role !== "ADMIN") {
      delete updateData.role;
    }
    if (updateData.password) {
      updateData.password = await bcrypt.hash(updateData.password, 10);
    }
    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      { $set: updateData },
      { new: true }
    );
    const { password, ...info } = updatedUser._doc;
    res.status(200).json(info);
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

//Delete
router.delete("/:id", verify, async (req, res) => {
  if (req.user.id !== req.params.id && req.user.role !== "ADMIN") {
    return res.status(403).json("You can delete only your own account!");
  }

  try {
    await User.findByIdAndDelete(req.params.id);
    res.status(200).json("User has been deleted.");
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

//Get
router.get("/find/:id", verify, async (req, res) => {
  if (req.user.id !== req.params.id && req.user.role !== "ADMIN") {
    return res.status(403).json("Permission denied!");
  }

  try {
    const user = await User.findById(req.params.id);
    const { password, ...info } = user._doc;
    res.status(200).json(info);
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

//Get All
router.get("/", verify, async (req, res) => {
  if (req.user.role !== "ADMIN") {
    return res.status(403).json("Permission denied!");
  }

  const query = req.query.new;
  try {
    const users = query
      ? await User.find().sort({ _id: -1 }).limit(8)
      : await User.find();

    const sanitized = users.map(({ _doc }) => {
      const { password, ...info } = _doc;
      return info;
    });

    res.status(200).json(sanitized);
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

//Get User Stats (users per month per year)
router.get("/stats", verify, async (req, res) => {
  if (req.user.role !== "ADMIN") {
    return res.status(403).json("Permission denied!");
  }

  try {
    const data = await User.aggregate([
      {
        $project: {
          year: { $year: "$createdAt" },
          month: { $month: "$createdAt" },
        },
      },
      {
        $group: {
          _id: {
            year: "$year",
            month: "$month",
          },
          total: { $sum: 1 },
        },
      },
      {
        $sort: {
          "_id.year": 1,
          "_id.month": 1,
        }
      }
    ]);
    res.status(200).json(data);
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

module.exports = router;