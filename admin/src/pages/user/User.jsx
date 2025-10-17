import "./User.scss";
import avatar from "../../assets/profile_avatar.png";
import { PermIdentityOutlined, PhoneIphoneOutlined, EmailOutlined, LocationOnOutlined, UploadFile, Female, Male, Transgender, AdminPanelSettings, History } from "@mui/icons-material";
import { Link, useLocation } from "react-router-dom";
import { useContext, useMemo, useRef, useState } from "react";
import Select from "react-select";
import countryList from "react-select-country-list";
import Notification from "../../components/notification/Notification";
import storage from "../../firebase";
import { ref, listAll, deleteObject, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import validateUser from "../../utils/validateUser";
import { UserContext } from "../../context/userContext/UserContext";
import { updateUser } from "../../context/userContext/ApiCalls";

export default function User() {
  const location = useLocation();
  const [user, setUser] = useState(location.state?.user);
  const [updatedUser, setUpdatedUser] = useState({});
  const updatedParams = useRef([]);
  const options = useMemo(() => countryList().getData(), []);
  const [img, setImg] = useState(null);
  const [preview, setPreview] = useState(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [validationMessage, setValidationMessage] = useState("");
  const [snackbarValidationOpen, setSnackbarValidationOpen] = useState(false);
  const [snackbarUploadOpen, setSnackbarUploadOpen] = useState(false);
  const [snackbarErrorOpen, setSnackbarErrorOpen] = useState(false);
  const { dispatch } = useContext(UserContext);

  // Sanity check
  if (!user) {
    return <h2 className="user-error">User not found.</h2>
  }

  const joinDate = new Date(user.createdAt);
  const formattedJoinDate = `${(joinDate.getMonth() + 1)
  .toString()
  .padStart(2, "0")}/${joinDate.getDate().toString().padStart(2, "0")}/${joinDate.getFullYear()}`;

  const handleTextChange = (e) => {
    const { name, value } = e.target;
    if (value !== "" && !updatedParams.current.includes(name)) updatedParams.current.push(name);
    setUpdatedUser((prevUser) => ({
      ...prevUser,
      [name]: value
    }));
  }
  
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

    if (!updatedParams.current.includes(e.target.name)) updatedParams.current.push(e.target.name)
  }
  
  const updateStorage = (item) => {
    if (!item.file) return Promise.resolve(null);
    
    return new Promise(async (resolve, reject) => {
      try {
        const storageRef = ref(storage, `/user/${item.hash}/`);
        const storageFolder = await listAll(storageRef);

        const fileToDelete = storageFolder.items.find(item => item.name.includes(item.label))
        if (fileToDelete) {
          await deleteObject(fileToDelete);
          console.log(`Old ${item.label} file successfully deleted.`)
        }

        const newFileName = `${item.hash}/${Date.now()}_${item.label}_${item.file.name}`;
        const newStorageRef = ref(storage, `/user/${newFileName}`);

        const uploadTask = uploadBytesResumable(newStorageRef, item.file);
        uploadTask.on(
          "state_changed",
          (snapshot) => {
            const progress = Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100);
            console.log(`${item.label} is ${progress}% done`);
          },
          (error) => {
            console.error(`Storage upload error:`, error);
            reject(error);
          },
          async () => {
            const url = await getDownloadURL(uploadTask.snapshot.ref);
            resolve({ [item.label]: url });
          }
        );
      } catch (error) {
        console.error("Storage list, deletion and creation error:", error);
        reject(error);
      }
    });
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    if (!updatedUser) return;
    
    const noneFileMap = [ "name", "username", "email", "password", "gender", "country", "phone", "isAdmin", "isActive" ];
    const nonUpdatedKeys = noneFileMap.filter(key => !updatedParams.current.includes(key));
    const mergedUser = { ...user, ...updatedUser };
      nonUpdatedKeys.forEach(key => {
      mergedUser[key] = user[key];
    });

    const validationError = validateUser(mergedUser);
      if (validationError) {
        setValidationMessage(validationError);
        setSnackbarValidationOpen(true);
        return;
      }

    if (updatedParams.current.includes("imgProfile")) {
      const hash = user.storageHash;
      setSnackbarUploadOpen(true);
      try {
        const uploadedImg = await updateStorage({ file: img, label: "imgProfile", hash })
        setSnackbarUploadOpen(false);
        const finalUser = Object.assign({}, mergedUser, uploadedImg || {});
        
        await updateUser(user._id, finalUser, dispatch);
        setSnackbarOpen(true);
        setUser(finalUser);
        console.log("User created successfully!");
      } catch (error) {
        console.error("User upload or creation failed.", error);
        setSnackbarErrorOpen(true);
      }
    } else {  
      try {
        await updateUser(user._id, mergedUser, dispatch);
        setSnackbarOpen(true);
        setUser(mergedUser);
        console.log("User updated successfully!");
      } catch (error) {
        console.error("User update failed.", error);
        setSnackbarErrorOpen(true); 
      }
    }
  }

  const handleSnackbarClose = (_, reason) => {
    if (reason === "clickaway") return;
    setSnackbarOpen(false);
    setSnackbarErrorOpen(false);
    setSnackbarUploadOpen(false);
    setSnackbarValidationOpen(false);
  };

  return (
    <div className="user">
      <div className="user-header">
        <h1>Edit User</h1>
        <Link to="/newuser">
          <button className="add-user-btn">Add New User</button>
        </Link>
      </div>

      <div className="user-body">
        <div className="profile-container">
          <div className="profile-header">
            <img src={user.imgProfile || avatar} alt="" />
            <div className="header">
              <span className="name">{user.name}</span>
              <span className="joined">joined: {formattedJoinDate}</span>
            </div>
          </div>
          <div className="profile-section">
            <span className="section-title">Account Details</span>
            <div className="section-entry">
              <PermIdentityOutlined className="icon" />
              <span>{user.username}</span>
            </div>
            <div className="section-entry">
              <LocationOnOutlined className="icon" />
              <span>{user.country}</span>
            </div>
            <div className="section-entry">
              {user.gender === "male" ? <Male className="icon" /> : user.gender === "female" ? <Female className="icon" /> : <Transgender className="icon" /> }
              <span>{user.gender}</span>
            </div>
          </div>
          <div className="profile-section">
            <span className="section-title">Conatct Details</span>
            <div className="section-entry">
              <PhoneIphoneOutlined className="icon" />
              <span>{user.phone}</span>
            </div>
            <div className="section-entry">
              <EmailOutlined className="icon" />
              <span>{user.email}</span>
            </div>
          </div>
          <div className="profile-section">
            <span className="section-title">Status</span>
            <div className="section-entry">
              <AdminPanelSettings className="icon" />
              <span>{user.isAdmin ? "admin user" : "normal user"}</span>
            </div>
            <div className="section-entry">
              <History className="icon" />
              <span>{user.isActive ? "active" : "non-active"}</span>
            </div>
          </div>
        </div>

        <div className="update-container">
          <div className="update-header">Edit</div>
          <form className="update-form">
            <div className="left-form">
              <div className="update-item">
                <label htmlFor="name" className="label">Full Name</label>
                <input 
                  type="text" 
                  id="name" 
                  name="name"
                  placeholder={user.name} 
                  className="item"
                  onChange={handleTextChange}
                />
              </div>
              <div className="update-item">
                <label htmlFor="username" className="label">Username</label>
                <input 
                  type="text" 
                  id="username" 
                  name="username"
                  placeholder={user.username} 
                  className="item"
                  onChange={handleTextChange}
                />
              </div>
              <div className="update-item">
                <label htmlFor="email" className="label">Email</label>
                <input 
                  type="text" 
                  id="email" 
                  name="email"
                  placeholder={user.email} 
                  className="item"
                  onChange={handleTextChange}
                />
              </div>
              <div className="update-item">
                <span className="label">Country of Residence</span>
                <Select 
                  options={options}
                  value={options.find(opt => opt.value === (updatedUser.country ?? user.country)) || null}
                  id="country"
                  name="country"
                  className="country"
                  onChange={(e) => {
                    if (!updatedParams.current.includes("country")) updatedParams.current.push("country");
                    setUpdatedUser(prev => ({ ...prev, country: e.value }));
                  }}
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
                      color: updatedUser.country ? 'black' : 'rgb(150, 150, 150)',
                    }),
                    option: (base, state) => ({
                      ...base,
                      color: 'black',
                      fontSize: '14px',
                      backgroundColor: state.isFocused ? 'var(--clr-font-sec)' : 'white',
                      cursor: 'pointer',
                    }),
                  }}
                />
              </div>
              <div className="update-item">
                <label htmlFor="phone" className="label">Phone</label>
                <input 
                  type="text" 
                  id="phone" 
                  name="phone"
                  placeholder={user.phone} 
                  className="item"
                  onChange={handleTextChange}
                />
              </div>
              <div className="update-item">
                <fieldset className="item-radio">
                  <legend className="label">Gender</legend>
                  <input 
                    type="radio"
                    name="gender"
                    id="male"
                    value="male"
                    onChange={handleTextChange}
                    checked={(updatedUser.gender ?? user.gender) === "male"}
                  />
                  <label htmlFor="male">Male</label>
                  <input 
                    type="radio" 
                    name="gender" 
                    id="female"
                    value="female" 
                    onChange={handleTextChange}
                    checked={(updatedUser.gender ?? user.gender) === "female"}
                  />
                  <label htmlFor="female">Female</label>
                  <input 
                    type="radio" 
                    name="gender"
                    id="other"
                    value="other" 
                    onChange={handleTextChange}
                    checked={(updatedUser.gender ?? user.gender) === "other"}
                  />
                  <label htmlFor="other">Other</label>
                </fieldset>
              </div>
            </div>
            <div className="right-form">
              <div className="update-photo">
                <img src={user.imgProfile || preview || avatar} alt="" />
                <label htmlFor="file"><UploadFile className="icon"/></label>
                <input 
                  type="file"
                  id="file"
                  name="imgProfile"
                  accept="image/*"
                  onChange={handleFileChange} 
                  style={{ display: "none" }}
                />
              </div>
              <button 
                className="update-user-btn"
                onClick={handleUpdate}
              >
                Update
              </button>
            </div>
          </form>
         
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
        snType="user updated"
        snOpen={snackbarOpen}
        snClose={handleSnackbarClose} 
      />
      <Notification
        snType="error"
        snOpen={snackbarErrorOpen}
        snClose={handleSnackbarClose} 
      />
    </div>
  );
}
