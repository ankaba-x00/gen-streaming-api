import "./Chart.scss";
import { LineChart, Line, XAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";


export default function Chart({ className, title, data, dataKey, grid }) {
  return (
    <div className="chart">
      <h3 className="chart-title">{title}</h3>
      <ResponsiveContainer width="100%" height="90%">
        <LineChart data={data} margin={{ top: 10, right: 10, left: 10, bottom: 10 }}>
          <XAxis dataKey="name" stroke="gray"/>
          <Line type="monotone" dataKey={dataKey} stroke="red"/>
          <Tooltip 
            contentStyle={{
            backgroundColor: "var(--clr-background)",
            border: "1px solid var(--clr-font-sec)",
            borderRadius: "4px"
          }}
          labelStyle={{
            color: "var(--clr-font-prim)",
          }}
          itemStyle={{
            color: "var(--clr-accent)",
          }}
          />
          {grid && <CartesianGrid stroke="#bebebeff" strokeDasharray="5 5"/>}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
