import axios from 'axios';

const baseUrl = 'erasiaback-production.up.railway.app/faceit';

export const getWeekStats = async (player_id: string) => {
    const response = await axios.get(`${baseUrl}/week-stats/${player_id}`);
    return response.data;
}

export const getWeekGraphStats = async (player_id: string) => {
    const response = await axios.get(`${baseUrl}/week-stats-graph/${player_id}`);
    return response.data;
}

export const getPlayerInfo = async (player_id: string) => {
    const response = await axios.get(`${baseUrl}/player/${player_id}`);
    return response.data;
}