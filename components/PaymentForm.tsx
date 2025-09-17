import { useState } from "react";
import PaymentService from "../services/PaymentService";

interface PaymentFormProps {
  readonly orderId: string;
  readonly token: string;
}

export default function PaymentForm({ orderId, token }: PaymentFormProps) {
  const [paymentMethod, setPaymentMethod] = useState("cash");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handlePay = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await PaymentService.pay(token, orderId, paymentMethod);
      setMessage("Payment successful!");
    } catch (err: any) {
      setError(err.response?.data?.message || "Payment failed");
    }
  };

  return (
    <form onSubmit={handlePay}>
      <h2>Payment</h2>
      {message && <p style={{ color: "green" }}>{message}</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}
      <select
        value={paymentMethod}
        onChange={(e) => setPaymentMethod(e.target.value)}
      >
        <option value="cash">Cash</option>
        <option value="card">Card</option>
      </select>
      <button type="submit">Pay</button>
    </form>
  );
}
