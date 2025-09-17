import { useEffect, useState } from "react";
import BrandService from "../services/BrandService";

export default function Brands() {
  const [brands, setBrands] = useState([]);

  useEffect(() => {
    BrandService.getAllBrands().then((res) => {
      setBrands(res.data.data);
    });
  }, []);

  return (
    <div>
      <h2>Brands</h2>
      <ul>
        {brands.map((brand: any) => (
          <li key={brand._id}>{brand.name}</li>
        ))}
      </ul>
    </div>
  );
}
