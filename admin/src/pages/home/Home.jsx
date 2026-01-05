import "./Home.scss";
import Featured from "../../components/Featured/Featured";
import Chart from "../../components/chart/Chart";
//import { userData } from "../../dummyData";
import WidgetSm from "../../components/widgetSm/WidgetSm";
import WidgetLg from "../../components/widgetLg/WidgetLg";
import { useEffect, useMemo, useState } from "react";
import axios from 'axios';

export default function Home() {
  const MONTHS = useMemo(
    () => [
      "JAN",
      "FEB",
      "MAR",
      "APR",
      "MAY",
      "JUN",
      "JUL",
      "AUG",
      "SEP",
      "OCT",
      "NOV",
      "DEC"
    ], []
  );
  const [userStats, setUserStats] = useState([]);

  useEffect(() => {
    const getStats = async () => {
      try {
        const res = await axios.get("/api/users/stats", {
          headers: {
            token: "Bearer " + JSON.parse(localStorage.getItem("user")).accessToken,
          }
        })
        const statsList = res.data.sort((a, b) => a._id - b._id);
        const statsData = statsList.map((item) => ({
          name: MONTHS[item._id - 1],
          "New User": item.total
        }));

        setUserStats(statsData);
      } catch (err) {
        console.log(err);
      }
    };
    getStats();
  }, [MONTHS]);

  //console.log(userStats)

  return (
    <div className="home">
      <Featured />
      <Chart data={userStats} title="User Analytics" dataKey="New User" grid/>
      <div className="home-widgets">
        <WidgetSm />
        <WidgetLg />
      </div>
    </div>
  );
}
