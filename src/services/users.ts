import type { User } from '@types';

import api, { type RespAPI } from './api';

export const UserService = {
  createUser: async (user: User): Promise<RespAPI<User>> => {
    return api.post(import.meta.env.VITE_API_URL + 'users', user);
  },

  updateUser: async (user: User): Promise<RespAPI<User>> => {
    return api.put(`${import.meta.env.VITE_API_URL}users/${user.id}`, user);
  },

  deleteUser: async (id: string) => {
    return api.delete(import.meta.env.VITE_API_URL + 'users/' + id);
  },

  getUsers: async (): Promise<RespAPI<User[]>> => {
    return api.get(import.meta.env.VITE_API_URL + 'users');
  },
};
