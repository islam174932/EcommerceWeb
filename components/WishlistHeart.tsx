import { useState } from "react";
import WishlistService from "../services/WishlistService";

interface WishlistHeartProps {
  readonly productId: string;
  readonly isWished: boolean;
  readonly token: string;
}

export default function WishlistHeart({
  productId,
  isWished,
  token,
}: WishlistHeartProps) {
  const [wished, setWished] = useState(isWished);
  const [loading, setLoading] = useState(false);

  const handleToggle = async () => {
    setLoading(true);
    try {
      if (wished) {
        await WishlistService.removeFromWishlist(productId, token);
        setWished(false);
      } else {
        await WishlistService.addToWishlist(productId, token);
        setWished(true);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      type="button"
      style={{
        cursor: "pointer",
        color: wished ? "red" : "gray",
        fontSize: "1.5rem",
        background: "none",
        border: "none",
        padding: 0,
        transition: "color 0.2s",
      }}
      onClick={handleToggle}
      aria-label={wished ? "Remove from wishlist" : "Add to wishlist"}
      disabled={loading}
    >
      {loading ? "..." : "♥"}
    </button>
  );
}
