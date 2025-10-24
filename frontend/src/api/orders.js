import {http} from './http.js';

export const OrdersApi = {
    list: () => http.get('/ordermasters'),
    get: (id) => http.get(`/ordermasters/${id}`),
    create: (dto) => http.post('/ordermasters', dto),
    update: (id, dto) => http.put(`/ordermasters/${id}`, dto),
    remove: (id) => http.delete(`/ordermasters/${id}`)
};
