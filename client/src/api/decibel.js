import axios from "./axios";

export const saveRequest = async (decibel) => axios.post(`/decibel`, decibel);
