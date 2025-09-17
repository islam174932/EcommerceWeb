import { useEffect, useState } from "react";
import CategoryService from "../services/CategoryService";

export default function Categories() {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    CategoryService.getAllCategories().then((res) => {
      setCategories(res.data.data);
    });
  }, []);

  return (
    <div>
      <h2>Categories</h2>
      <ul>
        {categories.map((cat: any) => (
          <li key={cat._id}>{cat.name}</li>
        ))}
      </ul>
    </div>
  );
}
