import {http} from './http.js';

export const FoodApi = {
    list: () => http.get('/fooditems')
};
