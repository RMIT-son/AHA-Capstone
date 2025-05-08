import axios from "axios";

const api = axios.create({
    baseURL: "http://127.0.0.1:5000/api",
});

// GET data
export const getData = () => api.get("/data").then((res) => res.data);

// POST data
export const postData = (payload) =>
    api.post("/data", payload).then((res) => res.data);
