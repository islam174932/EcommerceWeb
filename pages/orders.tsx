import { useEffect, useState } from "react";
import OrderService from "../services/OrderService";

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [token] = useState(""); // Replace with your auth logic

  useEffect(() => {
    if (token) {
      OrderService.getAllOrders(token).then((res) => {
        setOrders(res.data.data);
      });
    }
  }, [token]);

  return (
    <div>
      <h2>All Orders</h2>
      <ul>
        {orders.map((order: any) => (
          <li key={order._id}>
            Order #{order._id} - Status: {order.status}
          </li>
        ))}
      </ul>
    </div>
  );
}
