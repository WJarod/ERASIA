import User from '../models/User';
import axios from 'axios';

const baseUrl = 'https://erasiaback-production.up.railway.app/user';

export const getAll = async () => {
    const response = await axios.get(baseUrl);
    return response.data;
}

export const getOne = async (id: string) => {
    const response = await axios.get(`${baseUrl}/${id}`);
    return response.data;
}

export const create = async (newObject: User) => {
    const response = await axios.post(baseUrl, newObject);
    return response.data;
}

export const update = async (id: string, newObject: User) => {
    const response = await axios.put(`${baseUrl}/${id}`, newObject);
    return response.data;
}

export const remove = async (id: string) => {
    const response = await axios.delete(`${baseUrl}/${id}`);
    return response.data;
}

export const login = async (credentials: { username: string, password: string }) => {
    const response = await axios.post(`${baseUrl}/login`, credentials);
    return response.data;
}

