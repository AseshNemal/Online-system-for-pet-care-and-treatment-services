import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: 'https://online-system-for-pet-care-and-treatment.onrender.com', // Replace with your backend URL
  withCredentials: true, // Send cookies with requests
});

export default axiosInstance;
