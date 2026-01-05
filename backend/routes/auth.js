const router = require("express").Router();
const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const generateStorageHash = require("../utils/generateHash");

//Register
router.post("/register", async (req, res) => {
  try {
    const userCount = await User.countDocuments();

    const hashedPassword = await bcrypt.hash(req.body.password, 10);

    const newUser = new User({
      username: req.body.username,
      email: req.body.email,
      password: hashedPassword,
      role: userCount === 0 ? "ADMIN" : "USER",
      isActive: true,
      storageHash: generateStorageHash(),
    });

    const user = await newUser.save();
    res.status(201).json(user);
  } catch (err) {
    console.log(err)
    res.status(500).json(err);
  }
});

//Login
router.post("/login", async (req, res) => {
  try {
    const { identifier, password } = req.body;
    const user = await User.findOne({
      $or: [
        { username: identifier},
        { email: identifier },
      ]
    });
    if (!user) {
      return res.status(401).json("Wrong email or password");
    }

    const isPasswordValid = await bcrypt.compare(
      password,
      user.password
    );
    if (!isPasswordValid) {
      return res.status(401).json("Wrong email or password");
    }

    const accessToken = jwt.sign(
      {
        id: user._id,
        role: user.role,
      },
      process.env.TOKEN_KEY,
      { expiresIn: "1d" }
    );

    const { password: pwd, ...info } = user._doc;
    res.status(200).json({...info, accessToken});
  } catch (err) {
    console.error(err);
    res.status(500).json("Internal server error");
  }
});

module.exports = router;