// const axios = require('axios').default;
import axios from "axios";

const API_URL = "http://localhost:3000/";

export const getUsers = () => {
  try {
    const response = axios.get(API_URL + "users");
    return response;
  } catch (error) {
    console.error(error);
  }
};
