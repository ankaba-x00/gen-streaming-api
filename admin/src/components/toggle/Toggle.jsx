import "./Toggle.scss";
import { DarkMode, LightMode } from "@mui/icons-material";

export default function Toggle({ handleChange, isChecked }) {
  return (
    <div className="toggle">
      <label htmlFor="check"><LightMode className="icon"/></label>
      <input 
        type="checkbox" 
        id="check"
        className="toggle-switch"
        onChange={handleChange}
        checked={isChecked}
      />
      <label htmlFor="check"><DarkMode className="icon"/></label>
    </div>
  );
}

