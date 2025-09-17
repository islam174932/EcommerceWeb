import { useEffect, useState } from "react";
import Link from "next/link";
import ProductService from "../services/ProductService";

export default function Products() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    ProductService.getAllProducts().then((res) => {
      setProducts(res.data.data);
    });
  }, []);

  return (
    <div>
      <h2>Products</h2>
      <ul>
        {products.map((product: any) => (
          <li key={product._id}>
            <Link href={`/product/${product._id}`}>{product.title}</Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
