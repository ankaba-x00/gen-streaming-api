import "./WidgetLg.scss";

export default function WidgetLg() {
  const Button = ({type}) => {
    return <button className={"status-btn "+type}>{type}</button>;
  }

  return (
    <div className="widget-lg">
      <span className="widget-header">Latest Transactions</span>

      <table className="widget-table">
        <tbody>
          <tr className="table-tr">
            <th>Customer</th>
            <th>Date</th>
            <th>Amount</th>
            <th>Status</th>
          </tr>

          <tr className="table-tr">
            <td className="user">
              <img src="https://images.pexels.com/photos/1040880/pexels-photo-1040880.jpeg" alt="" />
              <span className="name">Charlie Miller</span>
            </td>
            <td>09/25/2025</td>
            <td>€112.00</td>
            <td className="status">
              <Button type="approved"/>
            </td>
          </tr>

          <tr className="table-tr">
            <td className="user">
              <img src="https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg" alt="" />
              <span className="name">Olga Wenkoweg</span>
            </td>
            <td>09/25/2025</td>
            <td>€79.50</td>
            <td className="status">
              <Button type="pending"/>
            </td>
          </tr>

          <tr className="table-tr">
            <td className="user">
              <img src="https://images.pexels.com/photos/6249038/pexels-photo-6249038.jpeg" alt="" />
              <span className="name">Camie Flue</span>
            </td>
            <td>09/25/2025</td>
            <td>€219.00</td>
            <td className="status">
              <Button type="rejected"/>
            </td>
          </tr>

          <tr className="table-tr">
            <td className="user">
              <img src="https://images.pexels.com/photos/1187765/pexels-photo-1187765.jpeg" alt="" />
              <span className="name">Theo Bastist</span>
            </td>
            <td>09/25/2025</td>
            <td>€72.99</td>
            <td className="status">
              <Button type="approved"/>
            </td>
          </tr>

          <tr className="table-tr">
            <td className="user">
              <img src="https://images.pexels.com/photos/33269094/pexels-photo-33269094.jpeg" alt="" />
              <span className="name">Joe Miller</span>
            </td>
            <td>09/25/2025</td>
            <td>€300.99</td>
            <td className="status">
              <Button type="pending"/>
            </td>
          </tr>
        </tbody>
      </table>

    </div>
  );
}
