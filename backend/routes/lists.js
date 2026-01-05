const router = require("express").Router();
const List = require("../models/List");
const verify = require("../utils/verifyToken");

//Create
router.post("/", verify, async (req, res) => {
  if (req.user.role == "ADMIN") {
    const newList = new List(req.body);
    try {
      const savedList = await newList.save();
      res.status(201).json(savedList);
    } catch (err) {
      res.status(500).json(err);
    }
  } else {
    res.status(403).json("Permission denied.");
  }
});

//Delete
router.delete("/:id", verify, async (req, res) => {
  if (req.user.role == "ADMIN") {
    try {
      await List.findByIdAndDelete(req.params.id);
      res.status(200).json("List has been deleted");
    } catch (err) {
      res.status(500).json(err);
    }
  } else {
    res.status(403).json("Permission denied.");
  }
});

//Update
router.put("/:id", verify, async (req, res) => {
  if (req.user.role == "ADMIN") {
    try {
      const updatedList = await List.findByIdAndUpdate(
        req.params.id, 
        { $set: req.body }, 
        { new: true }
      );
      res.status(200).json(updatedList);
    } catch (err) {
      res.status(500).json(err);
    }
  } else {
    res.status(403).json("Permission denied.");
  }
});

//Get
router.get("/", verify, async (req, res) => {
  const typeQuery = req.query.type;
  const genreQuery = req.query.genre;
  const source = req.headers["x-frontend"];
  if (!source) {
    return res.status(400).json({ message: "Missing x-frontend header" });
  }
  let list = [];
  try {
    if (source === "admin") {
      if (typeQuery) {
        if (genreQuery) {
          list = await List.find({ 
            type: typeQuery, 
            genre: { $in: [genreQuery] } 
          });
        } else {
          list = await List.find({ 
            type: typeQuery 
          });
        }
      } else {
        list = await List.find();
      }
    } else if (source === "client") {
      if (typeQuery) {
        if (genreQuery) {
          list = await List.aggregate([
            { $match: { 
              type: typeQuery, 
              genre: { $in: [genreQuery] } 
            } },
            { $sample: { size: 12 } },
          ]);
        } else {
          list = await List.aggregate([
            { $match: { type: typeQuery } },
            { $sample: { size: 12 } },
          ]);
        }
      } else {
        list = await List.aggregate([{ $sample: { size: 12 } }]);
      }
    }
    if (!list.length) {
      return res.status(404).json("No lists found");
    }
    res.status(200).json(list);
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;