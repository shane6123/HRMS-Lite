import axios from 'axios';

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5001/api',
});

export const getEmployees = () => api.get('/employees');
export const addEmployee = (data) => api.post('/employees', data);
export const deleteEmployee = (id) => api.delete(`/employees/${id}`);

export const markAttendance = (data) => api.post('/attendance', data);
export const getAttendance = (employeeId) => api.get(`/attendance/${employeeId}`);

export default api;
