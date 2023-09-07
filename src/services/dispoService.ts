import axios from "axios";
import Dispo from "../models/Dispo";

const baseUrl = "erasiaback-production.up.railway.app/dispo";

export const getByWeek = async (week: Date) => {
    const response = await axios.get(`${baseUrl}/findByWeek/${week}`);
    return response.data;
}


export const getByUserAndWeek = async (week: Date, userId: string) => {
    const response = await axios.get(`${baseUrl}/findByUserAndWeek/${userId}/${week}`);
    return response.data;
}

export const create = async (newObject: Dispo) => {
    const response = await axios.post(baseUrl, newObject);
    return response.data;
}

export const editByUserAndWeek = async (week: Date, userId: string, newObject: Dispo) => {
    const response = await axios.put(`${baseUrl}/editByUserAndWeek/${userId}/${week}`, newObject);
    return response.data;
}

