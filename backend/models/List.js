const mongoose = require("mongoose");

const ListSchema = new mongoose.Schema(
  {
    title: { 
      type: String,
      minlength: [1, "Title must be at least 1 character"],
      maxlength: [100, "Title cannot exceed 100 characters"],
      match: [/^[A-Za-z0-9\s-\']+$/, "Title may only contain letters, numbers, spaces and -"],
      required: [true, "Title is required"],
    },
    type: { 
      type: String,
      enum: ["movie", "series"],
      required: [true, "Type is required"],
    },
    genre: { 
      type: [String],
      enum: ["Adventure", "Action", "Children", "Comedy", "Crime", "Fantasy", "Historical", "Horror", "Musical", "Romance", "Sci-Fi", "Sports", "Thriller", "Western", "Animation", "Drama", "Documentary"],
      required: [true, "Genre is required"],
    },
    content:{
      type: [String],
      minlength: [10, "List must have at least 10 items"],
      required: [true, "List content is required"],
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("List", ListSchema);