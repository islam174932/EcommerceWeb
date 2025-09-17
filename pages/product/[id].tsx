import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import ProductService from "../../services/ProductService";

export default function ProductDetails() {
  const router = useRouter();
  const { id } = router.query;
  const [product, setProduct] = useState<any>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    if (id) {
      ProductService.getAllProducts()
        .then((res) => {
          const found = res.data.data.find((p: any) => p._id === id);
          setProduct(found);
        })
        .catch(() => setError("Failed to load product"));
    }
  }, [id]);

  if (error) return <p>{error}</p>;
  if (!product) return <p>Loading product...</p>;

  return (
    <div>
      <h2>{product.title}</h2>
      <p>{product.description}</p>
      <p>Price: {product.price}</p>
      {/* Add to cart, wishlist, etc. */}
    </div>
  );
}
