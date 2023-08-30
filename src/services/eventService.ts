import axios from "axios";
import Event from "../models/Event";

const baseUrl = "https://teamgh-production.up.railway.app/event";

export const postEvent = async (newObject: Event) => {
    const response = await axios.post(baseUrl, newObject);
    return response.data;
}

export const getEvents = async () => {
    const response = await axios.get(baseUrl);
    return response.data;
}