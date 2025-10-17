import "./Featured.scss";
import { ArrowDownward, ArrowUpward } from "@mui/icons-material";

export default function Featured() {
  return (
    <div className="featured">
      <div className="featured-item">
        <span className="item-header">Revenue</span>
        <div className="item-body">
          <span className="money">€1,525</span>
          <span className="rate">-9.6 <ArrowDownward className="arrow negative"/></span>
        </div>
        <span className="item-footer">Compared to last month</span>
      </div>

      <div className="featured-item">
        <span className="item-header">Sales</span>
        <div className="item-body">
          <span className="money">€3,333</span>
          <span className="rate">-0.8 <ArrowDownward className="arrow negative"/></span>
        </div>
        <span className="item-footer">Compared to last month</span>
      </div>

      <div className="featured-item">
        <span className="item-header">Cost</span>
        <div className="item-body">
          <span className="money">€2,771</span>
          <span className="rate">+2.6 <ArrowUpward className="arrow positive"/></span>
        </div>
        <span className="item-footer">Compared to last month</span>
      </div>
    </div>
  );
}
