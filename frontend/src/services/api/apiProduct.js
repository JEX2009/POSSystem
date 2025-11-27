import {apiClient} from "./../apiClient"

export const createProducts = async (product) =>{
    try {
        const response = await apiClient.post('/product/',product);
        return response.data;
    } catch (error) {
        throw error;
    }
}

export const featchProducts = async () => {
    try {
        const response = await apiClient.get('/product/');
        return response.data;
    } catch (error) {
        console.error('Error fetching products:', error);
        throw error;
    }
};