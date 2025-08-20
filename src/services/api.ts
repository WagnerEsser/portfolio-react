import axios from "axios";
import type { User } from "../types";

export const createUser = (user: User) => {
  const response = axios.post(import.meta.env.VITE_API_URL + "users", user);
  return response;
};

export const updateUser = (user: User) => {
  const response = axios.put(
    import.meta.env.VITE_API_URL + "users/" + user.id,
    user
  );
  return response;
};

export const deleteUser = (id: string) => {
  const response = axios.post(import.meta.env.VITE_API_URL + "users/" + id);
  return response;
};

export const getUsers = () => {
  const response = axios.get(import.meta.env.VITE_API_URL + "users");
  return response;
};
