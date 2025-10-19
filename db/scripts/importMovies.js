import mongoose from "mongoose";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import fs from "fs";
import { bucket } from "../config/firebase.js";
import Movie from "../models/Movie.js";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const moviesPathArg = process.argv[2];
if (!moviesPathArg) {
  console.error(`
    Please provide path to movie JSON file for import.
    
    Usage:  npm run import:movies -- <path-to-file>
    `);
  process.exit(1);
}

const moviesPath = path.join(__dirname, moviesPathArg);
const movies = JSON.parse(fs.readFileSync(moviesPath, "utf-8"));

function generateStorageHash(len = 25) {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let hash = "";
  for (let i = 0; i < len; i++) {
    hash += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return hash;
}

async function uploadFileToFirebase(localPath, hash, label, filename) {
  try {
    const destination = `media/${hash}/${Date.now()}_${label}_${filename}`;

    await bucket.upload(localPath, {
      destination,
      metadata: {
        cacheControl: "public, max-age=31536000",
      },
    });

    const encodedPath = encodeURIComponent(destination);
    const bucketName = "netflixpp-112d6.firebasestorage.app";

    return `https://firebasestorage.googleapis.com/v0/b/${bucketName}/o/${encodedPath}?alt=media`;
  } catch (err) {
    console.error("Error uploading file to Firebase:", localPath, err.message);
    return null;
  }
}



async function importMovies() {
  try {
    console.log("Connecting to MongoDB with URL:", process.env.MONGO_URL);
    try {
      await mongoose.connect(process.env.MONGO_URL, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      });
      console.log("MongoDB Connection Successful");
    } catch (err) {
      console.error("MongoDB connection error:", err.message);
      process.exit(1);
    }

    for (const movie of movies) {
      const hash = movie.storageHash || generateStorageHash();

      // Upload images if they exist locally
      if (movie.img && movie.img.startsWith("./")) {
        const imgPath = path.join(__dirname, "../data", movie.img);
        const imgFileName = path.basename(movie.img);
        const imgUrl = await uploadFileToFirebase(imgPath, hash, "img", imgFileName);
        if (imgUrl) movie.img = imgUrl;
      }

      if (movie.imgSm && movie.imgSm.startsWith("./")) {
        const imgSmPath = path.join(__dirname, "../data", movie.imgSm);
        const imgSmFileName = path.basename(movie.imgSm);
        const imgSmUrl = await uploadFileToFirebase(imgSmPath, hash, "imgSm", imgSmFileName);
        if (imgSmUrl) movie.imgSm = imgSmUrl;
      }

      movie.storageHash = hash;

      try {
        const saved = await Movie.create(movie);
        console.log(`Added movie to mongodb: ${saved.title}`);
      } catch (err) {
        if (err.code === 11000) {
          console.warn(`Skipping duplicate in mongodb: ${movie.title}`);
        } else {
          console.error(`Could not add movie to mongodb "${movie.title}": ${err.message}`);
        }
      }
    }

    console.log("All movies processed!");
    process.exit(0);
  } catch (err) {
    console.error("Error processing movies:", err);
    process.exit(1);
  }
}

importMovies();
