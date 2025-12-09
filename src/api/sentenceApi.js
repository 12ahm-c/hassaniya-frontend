import axios from "axios";

const API = `${import.meta.env.VITE_API_URL}/api/sentences`;

export const getSentences = () => axios.get(API);
export const addSentence = (data) => axios.post(API, data);
export const updateSentence = (id, data) => axios.put(`${API}/${id}`, data);
export const deleteSentence = (id) => axios.delete(`${API}/${id}`);