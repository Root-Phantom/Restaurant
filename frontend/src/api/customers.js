import {http} from './http.js';

export const CustomersApi = {
    list: () => http.get('/customers')
};
