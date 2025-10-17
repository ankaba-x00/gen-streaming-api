import "./NewUser.scss";
import avatar from "../../assets/profile_avatar.png";
import Notification from "../../components/notification/Notification";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import storage from "../../firebase";
import { UploadFile } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { useContext, useState, useMemo } from "react";
import Select from "react-select";
import countryList from "react-select-country-list";
import validateUser from "../../utils/validateUser";
import { UserContext } from "../../context/userContext/UserContext";
import { createUser } from "../../context/userContext/ApiCalls";

export default function NewUser() {
  const [user, setUser] = useState({
    isAdmin: "no",
    isActive: "yes",
  });
  const options = useMemo(() => countryList().getData(), []);
  const [img, setImg] = useState(null);
  const [preview, setPreview] = useState(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [validationMessage, setValidationMessage] = useState("");
  const [snackbarValidationOpen, setSnackbarValidationOpen] = useState(false);
  const [snackbarUploadOpen, setSnackbarUploadOpen] = useState(false);
  const [snackbarErrorOpen, setSnackbarErrorOpen] = useState(false);
  const navigate = useNavigate();

  const { dispatch } = useContext(UserContext);

  const handleTextChange = (e) => {
    const value = e.target.value;
    setUser({...user, [e.target.name]: value})
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      alert("Please upload a valid image file (e.g., JPG, PNG, WEBP).");
      return;
    }
    const previewUrl = URL.createObjectURL(file);
    setPreview(previewUrl);
    setImg(file);
  };

  const uploadToStorage = (item) => {
    if (!item.file) return Promise.resolve(null);
    
    return new Promise((resolve, reject) => {
      const fileName = `${item.hash}/${Date.now()}_${item.label}_${item.file.name}`;
      const storageRef = ref(storage, `/user/${fileName}`);
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

    if (!user) return;

    const validationError = validateUser(user);
      if (validationError) {
        setValidationMessage(validationError);
        setSnackbarValidationOpen(true);
        return;
      }

    const hash = generateStorageHash();
    setSnackbarUploadOpen(true);
    try {      
      const uploadedImg = await uploadToStorage({ file: img, label: "imgProfile", hash });
      setSnackbarUploadOpen(false);

      const finalUser = Object.assign({}, user, { storageHash: hash}, uploadedImg || {});

      await createUser(finalUser, dispatch);
      setSnackbarOpen(true);
      console.log("User created successfully!");
      setTimeout(() => {
        navigate("/users");
      }, 5000);
    } catch (error) {
      console.error("User upload or creation failed.", error);
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
    <div className="newuser">
      <div className="newuser-header">New User</div>
      <div className="newuser-form">
        <div className="form-section">
          <div className="enter-item">
            <label htmlFor="name" className="label">Full Name</label>
            <input 
              type="text" 
              id="name" 
              placeholder="Jane Doe" 
              className="item"
              name="name"
              onChange={handleTextChange}
            />
          </div>
          <div className="enter-item">
            <label htmlFor="username" className="label">Username</label>
            <input 
              type="text"
              id="username"
              placeholder="JaneDoe123"
              className="item"
              name="username"
              onChange={handleTextChange}
            />
          </div>
          <div className="enter-item">
            <fieldset className="item-radio">
              <legend className="label">Gender</legend>
              <input 
                type="radio"
                name="gender"
                id="male"
                value="male"
                onChange={handleTextChange}
                checked={user.gender === "male"}
              />
              <label htmlFor="male">Male</label>
              <input 
                type="radio" 
                name="gender" 
                id="female"
                value="female" 
                onChange={handleTextChange}
                checked={user.gender === "female"}
              />
              <label htmlFor="female">Female</label>
              <input 
                type="radio" 
                name="gender"
                id="other"
                value="other" 
                onChange={handleTextChange}
                checked={user.gender === "other"}
              />
              <label htmlFor="other">Other</label>
            </fieldset>
          </div>
          <div className="enter-item">
            <label htmlFor="email" className="label">Email</label>
            <input 
              type="text"
              name="email"
              id="email"
              placeholder="jane@doe.com"
              className="item"
              onChange={handleTextChange}
            />
          </div>
          <div className="enter-item">
            <label htmlFor="password" className="label">Password</label>
            <input 
              type="password" 
              name="password"
              id="password" 
              placeholder="********" 
              className="item"
              onChange={handleTextChange}
            />
          </div>
          <div className="enter-item">
            <label htmlFor="admin" className="label">Admin</label>
            <select 
              name="isAdmin" 
              id="admin" 
              className="item-select"
              value={user.isAdmin}
              onChange={handleTextChange}
            >
              <option value="no">No</option>
              <option value="yes">Yes</option>
            </select>
          </div>
        </div>
        <div className="form-section">
          <div className="enter-item">
            <span className="label">Profile Picture</span>
            <div className="enter-img">
              <img 
                src={preview || avatar} 
                alt="preview current profile img" 
              />
              <label 
                htmlFor="profileImg"
              >
                <UploadFile className="icon"/>
              </label>
              <input 
                type="file" 
                id="profileImg" 
                name="imgProfile"
                accept="image/*"
                style={{ display: "none" }}
                onChange={e => handleFileChange(e)} 
              />
            </div>
          </div>
          <div className="enter-item">
            <label htmlFor="phone" className="label">Phone</label>
            <input 
              type="text"
              id="phone"
              name="phone"
              placeholder="01-111-111-1"
              className="item"
              onChange={handleTextChange}
            />
          </div>
          <div className="enter-item">
            <span className="label">Country of Residence</span>
            <Select 
              options={options}
              value={options.find(opt => opt.value === user.country) || null}
              id="country"
              name="country"
              className="country"
              onChange={(e) => 
                setUser(prev => ({ ...prev, country: e.value }))
              }
              placeholder="---"
              styles={{
                control: (base, state) => ({
                  ...base,
                  width: '220px',
                  border: '1px solid black',
                  borderRadius: '0',
                  marginLeft: '20px',
                  boxShadow: state.isFocused ? '0 0 5px var(--clr-boxshadow)' : 'none',
                  color: 'var(--clr-font-prim)',
                  fontSize: '14px',
                  cursor: 'pointer',
                  '&:hover': { borderColor: 'transparent' },
                }),
                singleValue: (base) => ({
                  ...base,
                  color: 'black',
                }),
                option: (base, state) => ({
                  ...base,
                  color: 'black',
                  fontSize: '14px',
                  backgroundColor: state.isFocused ? 'var(--clr-font-sec)' : 'white',
                  cursor: 'pointer',
                }),
                placeholder: (base) => ({
                  ...base,
                  color: 'rgb(150, 150, 150)',
                }),
              }}
            />
          </div>
          <div className="enter-item">
            <label htmlFor="active" className="label">Active</label>
            <select 
              name="isActive" 
              id="active" 
              className="item-select"
              value={user.isActive}
              onChange={handleTextChange}
            >
              <option value="yes">Yes</option>
              <option value="no">No</option>
            </select>
          </div>
          <button 
            className="newuser-create-btn"
            onClick={handleUploadAndCreate}
          >Create</button>
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
          snType="user created"
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
