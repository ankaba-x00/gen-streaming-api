import mongoose from "mongoose";

const MovieSchema = new mongoose.Schema(
  {
    title: { 
      type: String,
      trim: true,
      minlength: [1, "Title must be at least 1 character"],
      maxlength: [100, "Title cannot exceed 100 characters"],
      match: [/^[A-Za-z0-9\s&.,?!+:'\-]+$/, "Title may only contain letters, numbers, spaces, and & . , ? ! + - ' : "],
      required: [true, "Title is required"],
    },
    year: { 
      type: Number,
      min: [1888, "Release year cannot be earlier than 1888"],
      max: [2030, "Release year cannot be later than 2030"],
      required: [true, "Release year is required"],
    },
    duration: { 
      type: Number, 
      min: [1, "Duration of movie must be at least 1 min long"],
      max: [900, "Duration of movie cannot exceed 900 min"],
      required: [true, "Duration is required"],
    },
    limit: { 
      type: String, 
      trim: true,
      enum: ["U","PG","6+","9+","11+","12+","14+","15+","16+","18+","19+"],
      required: [true, "Age limit is required"],
    },
    isSeries: { 
      type: Boolean, 
      required: true 
    },
    genre: { 
      type: [String],
      enum: ["Adventure", "Action", "Children", "Comedy", "Crime", "Fantasy", "Historical", "Horror", "Musical", "Romance", "Sci-Fi", "Sports", "Thriller", "Western", "Animation", "Drama", "Documentary"], 
      required: [true, "Genre is required"],
    },
    imgSmText: { 
      type: String,
      trim: true,
      minlength: [25, "Thumbnail description must be at least 25 characters"],
      maxlength: [250, "Thumbnail description cannot exceed 450 characters"],
      match: [/^[A-Za-z0-9\s&.,?!+/*:'\-]+$/, "Text may only contain letters, numbers, spaces, and & . , ? ! / + - ' :"],
      required: [true, "Thumbnail description is required"],
    },
    imgText: { 
      type: String,
      trim: true,
      minlength: [25, "Feature description must be at least 25 characters"],
      maxlength: [450, "Feature description cannot exceed 450 characters"],
      match: [/^[A-Za-z0-9\s&.,?!/+:'\-]+$/, "Text may only contain letters, numbers, spaces, and & . , ? ! / + - ' :"],
      required: [true, "Feature description is required"],
    },
    storageHash: {
      type: String, 
      required: [true, "Storage hash is required for objects containing all media files"],
      unique: true 
    },
    imgSm: { 
      type: String, 
      required: [true, "Thumbnail image is required"],
    },
    img: { 
      type: String, 
      required: [true, "Feature image is required"],
    },
    trailer: { 
      type: String, 
      required: [true, "Trailer is required"],
    },
    video: { 
      type: String, 
      required: [true, "Video is required"], 
    },
  },
  { timestamps: true }
);

export default mongoose.model("Movie", MovieSchema);