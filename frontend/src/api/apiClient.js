import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080/api';

const apiClient = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

export const getProblems = async () => {
    const response = await apiClient.get('/problems');
    return response.data;
};

export const getProblem = async (id) => {
    const response = await apiClient.get(`/problems/${id}`);
    return response.data;
};

export const getHint = async (problemId, level) => {
    const response = await apiClient.get(`/problems/${problemId}/hints/${level}`);
    return response.data;
};

export const submitCode = async (submissionData) => {
    const response = await apiClient.post('/submissions', submissionData);
    return response.data;
};

export const sendChatMessage = async (problemId, chatRequest) => {
    const response = await apiClient.post(`/problems/${problemId}/chat`, chatRequest);
    return response.data;
};

export default apiClient;
