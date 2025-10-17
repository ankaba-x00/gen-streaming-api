import "./NewMovie.scss";
import { useContext, useState } from "react"; 
import { UploadFile } from "@mui/icons-material";
import avatar from "../../assets/movie_avatar.png";
import Notification from "../../components/notification/Notification";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import storage from "../../firebase";
import validateMovie from "../../utils/validateMovie";
import { MovieContext } from "../../context/movieContext/MovieContext";
import { createMovie } from "../../context/movieContext/ApiCalls";
import { useNavigate } from "react-router-dom";

export default function NewMovie() {
  const [movie, setMovie] = useState({});
  const [imgSm, setImgSm] = useState(null);
  const [previewSm, setPreviewSm] = useState(null);
  const [img, setImg] = useState(null);
  const [preview, setPreview] = useState(null);
  const [trailer, setTrailer] = useState(null);
  const [video, setVideo] = useState(null);
  const [selectedGenre, setSelectedGenre] = useState([]);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [validationMessage, setValidationMessage] = useState("");
  const [snackbarValidationOpen, setSnackbarValidationOpen] = useState(false);
  const [snackbarUploadOpen, setSnackbarUploadOpen] = useState(false);
  const [snackbarErrorOpen, setSnackbarErrorOpen] = useState(false);
  const navigate = useNavigate();

  const { dispatch } = useContext(MovieContext);

  const genres = [
    "Action", "Adventure", "Animation", "Comedy", "Crime", "Documentary", "Drama", "Fantasy", "Historical", "Horror", "Romance", "Sci-Fi", "Thriller", "Western"
  ];

  const handleTextChange = (e) => {
    const value = e.target.value;
    setMovie({...movie, [e.target.name]: value})
  };

  const handleGenreChange = (genre) => {
    setSelectedGenre((prev) => {
      let updated;
      if (prev.includes(genre)) {
        updated = prev.filter((g) => g !== genre);
      } else {
        updated = [...prev, genre];
      }
      setMovie((prevMovie) => ({
        ...prevMovie,
        genre: updated,
      }));
      return updated;
    });
  }

  const handleFileChange = (e, type) => {
    const file = e.target.files[0];
    if (!file) return;

    const isVideo = type === "video" || type === "trailer";
    const isImage = type === "img" || type === "imgSm";
    if (isVideo && !file.type.startsWith("video/")) {
      alert("Please upload a valid video file (e.g., MP4, MOV, WEBM).");
      return;
    }
    if (isImage && !file.type.startsWith("image/")) {
      alert("Please upload a valid image file (e.g., JPG, PNG, WEBP).");
      return;
    }
    const previewUrl = isImage ? URL.createObjectURL(file) : null;

    const actions = {
      img: () => { setImg(file); setPreview(previewUrl); },
      imgSm: () => { setImgSm(file); setPreviewSm(previewUrl); },
      trailer: () => { setTrailer(file); },
      video: () => { setVideo(file); },
    };
    if (actions[type]) actions[type]();
  };

  const uploadToStorage = (items) => {
    return items.map((item) => {
      if (!item.file) return Promise.resolve(null);
      
      return new Promise((resolve, reject) => {
        const fileName = `${item.hash}/${Date.now()}_${item.label}_${item.file.name}`;
        const storageRef = ref(storage, `/media/${fileName}`);
        const uploadTask = uploadBytesResumable(storageRef, item.file);
        uploadTask.on(
          "state_changed",
          (snapshot) => {
            const progress = Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100);
            console.log(`${item.label} is ${progress}% done`);
          },
          (error) => {
            console.error("Storage upload error:", error);
            reject(error);
          },
          async () => {
            const url = await getDownloadURL(uploadTask.snapshot.ref);
            resolve({ [item.label]: url });
          }
        );
      });
    });
  };

  function generateStorageHash(len=25) {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let hash = '';
    for (let i = 0; i < len; i++) {
      hash += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return hash;
  }

  const handleUploadAndCreate = async (e) => {
    e.preventDefault();
    if (!movie) return;
    
    const hash = generateStorageHash();
    setSnackbarUploadOpen(true);
    try {      
      const uploadedItems = await Promise.all(
        uploadToStorage([
          { file: img, label: "img", hash },
          { file: imgSm, label: "imgSm", hash },
          { file: trailer, label: "trailer", hash },
          { file: video, label: "video", hash },
        ])
      );
      setSnackbarUploadOpen(false);

      const finalMovie = Object.assign({}, movie, { storageHash: hash}, ...uploadedItems);

      const validationError = validateMovie(finalMovie);
      if (validationError) {
        setValidationMessage(validationError);
        setSnackbarValidationOpen(true);
        return;
      }

      await createMovie(finalMovie, dispatch);
      setSnackbarOpen(true);
      console.log("Movie created successfully!");
      setTimeout(() => {
        navigate("/movies");
      }, 5000);
    } catch (error) {
      console.error("Movie upload or creation failed.", error);
      setSnackbarErrorOpen(true);
    }
  };

  const handleSnackbarClose = (_, reason) => {
    if (reason === "clickaway") return;
    setSnackbarOpen(false);
    setSnackbarErrorOpen(false);
    setSnackbarUploadOpen(false);
    setSnackbarValidationOpen(false);
  };

  return (
    <div className="newmovie">
      <div className="newmovie-header">New Media</div>
      <div className="newmovie-form">

        <div className="section-left">
          <div className="enter-item">
            <label className="label" htmlFor="title">Title</label>
            <input 
              type="text"
              id="title"
              name="title"
              placeholder="Title"
              minLength="1"
              maxLength="100"
              onChange={handleTextChange}
            />
          </div>
          <div className="enter-item">
            <label className="label" htmlFor="year">Release year</label>
            <input 
              type="number" 
              min="1888"
              max="2030"
              id="year" 
              name="year"
              placeholder="yyyy"
              className="short-input"
              onChange={handleTextChange}
            />
          </div>
          <div className="enter-item">
            <label className="label" htmlFor="duration">Duration (min)</label>
            <input 
              type="number"
              min="1"
              max="900"
              id="duration" 
              name="duration" 
              placeholder="xxx" 
              className="short-input"
              onChange={handleTextChange}
            />
          </div>
          <div className="enter-item">
            <label className="label" htmlFor="limit">Age Limit</label>
            <input 
              type="text"
              id="limit"
              name="limit"
              placeholder="x+"
              className="short-input"
              onChange={handleTextChange}
            />
          </div>
          <div className="enter-item">
            <label className="label" htmlFor="isSeries">Type</label>
            <select 
              name="isSeries" 
              id="isSeries"
              onChange={handleTextChange}
            >
              <option value="">---</option>
              <option value="false">Movie</option>
              <option value="true">Series</option>
            </select>
          </div>
          <div className="enter-item">
            <span className="label">Trailer Path</span>
            <div>
              <label htmlFor="trailer"></label>
              <input 
                type="file" 
                id="trailer" 
                name="trailer"
                accept="video/*"
                onChange={e => handleFileChange(e, "trailer")} 
              />
            </div>
          </div>
          <div className="enter-item">
            <span className="label">Video Path</span>
            <div>
              <label htmlFor="video"></label>
              <input 
                type="file" 
                id="video" 
                name="video"
                accept="video/*"
                onChange={e => handleFileChange(e, "video")}  
              />
            </div>
          </div>
        </div>

        <div className="section-right">
          <div className="image-section">
            <div className="enter-item">
              <span className="label">Thumbnail Image</span>
              <div className="enter-img">
                <img 
                  src={previewSm || avatar}
                  alt="preview current thumbnail img" 
                />
                <label htmlFor="file-imgSm">
                  <UploadFile className="icon"/>
                </label>
                <input 
                  type="file" 
                  id="file-imgSm" 
                  name="imgSm" 
                  accept="image/*"
                  onChange={e => handleFileChange(e, "imgSm")} 
                  style={{ display: "none" }}
                />
              </div>
            </div>
            <div className="enter-item">
              <span className="label">Thumbnail Description</span>
              <textarea 
                className="enter-text" 
                id="description-imgSm" 
                placeholder="Text" 
                name="imgSmText" 
                minLength="25"
                maxLength="250"
                onChange={handleTextChange}
              ></textarea>
            </div>
          </div>
          <div className="image-section">
            <div className="enter-item">
              <span className="label">Feature Image</span>
              <div className="enter-img">
                <img 
                  src={preview || avatar} 
                  alt="preview current feature img" 
                />
                <label htmlFor="file-img">
                  <UploadFile className="icon"/>
                </label>
                <input 
                  type="file" 
                  id="file-img" 
                  name="img" 
                  accept="image/*"
                  onChange={e => handleFileChange(e, "img")} 
                  style={{ display: "none" }}
                />
              </div>
            </div>
            <div className="enter-item">
              <span className="label">Feature Description</span>
              <textarea 
                className="enter-text" 
                id="description-img" 
                placeholder="Text" 
                name="imgText" 
                minLength="25"
                maxLength="450"
                onChange={handleTextChange}
              ></textarea>
            </div>
          </div>
          <div className="genre-section">
            <span className="label">Genre</span>
            <div className="dropdown">
              {genres.map((genre) => (
                <label 
                  key={genre} 
                  className="dropdown-item"
                >
                  <input
                    type="checkbox"
                    name="genre"
                    value={genre}
                    checked={selectedGenre?.includes(genre) || false}
                    onChange={() => handleGenreChange(genre)}
                  />
                  {genre}
                </label>
              ))}
            </div>
          </div>
          <div className="btn">
            <button
              className="newmovie-btn"
              onClick={handleUploadAndCreate}
            >Create</button>
          </div>
        </div>
        <Notification
          snType="validation"
          snOpen={snackbarValidationOpen}
          snClose={handleSnackbarClose}
          snMessage={validationMessage}
        />
        <Notification
          snType="upload"
          snOpen={snackbarUploadOpen}
          snClose={handleSnackbarClose} 
        />
        <Notification
          snType="movie created"
          snOpen={snackbarOpen}
          snClose={handleSnackbarClose} 
        />
        <Notification
          snType="error"
          snOpen={snackbarErrorOpen}
          snClose={handleSnackbarClose} 
        />
      </div>
    </div>
  );
}
