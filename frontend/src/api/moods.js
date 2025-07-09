import axios from "../lib/axiosInstance";

export const getMoods = () => {
  return axios.get("/moods/");
};
