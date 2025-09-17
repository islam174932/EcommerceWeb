import { useEffect, useState } from "react";
import CartService from "../services/CartService";

interface CartProps {
  readonly token: string;
}

export default function Cart({ token }: CartProps) {
  const [cart, setCart] = useState<any>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    if (token) {
      CartService.getCart(token)
        .then((res) => setCart(res.data.data))
        .catch((err) => setError("Failed to load cart"));
    }
  }, [token]);

  if (!token) return <p>Please login to view your cart.</p>;
  if (error) return <p>{error}</p>;
  if (!cart) return <p>Loading cart...</p>;

  return (
    <div>
      <h2>Your Cart</h2>
      <ul>
        {cart.products.map((item: any) => (
          <li key={item.product._id}>
            {item.product.title} - Quantity: {item.count}
          </li>
        ))}
      </ul>
      <p>Total Price: {cart.totalCartPrice}</p>
    </div>
  );
}
