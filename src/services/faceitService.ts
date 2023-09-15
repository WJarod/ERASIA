import axios from 'axios';

const baseUrl = 'https://erasiaback-production.up.railway.app/faceit';
// const baseUrl = '//localhost:8000/faceit';

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

export const getStats = async (player_id: string) => {
    const response = await axios.get(`${baseUrl}/player-stats/${player_id}`);
    return response.data;
}