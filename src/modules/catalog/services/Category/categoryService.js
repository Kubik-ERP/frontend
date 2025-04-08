const API_URL = `${import.meta.env.VITE_API_URL}/api/categories`;
import axios from 'axios';
export const getAllCategories = async () => {
  const response = await axios.get(API_URL);
  return response.data.data.map((cat) => ({
    ID: cat.id,
    Category: cat.name,
    Description: cat.notes ?? '-',
  }));
};
