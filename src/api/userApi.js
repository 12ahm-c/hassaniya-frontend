import axios from "axios";

const API = `${import.meta.env.VITE_API_URL}/api/users`;

export const getUsers = () => axios.get(API);
export const loginUser = ({ email, code }) => axios.post(`${API}/login`, { email, code });