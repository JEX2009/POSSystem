import {apiClient} from "./../apiClient"

export const createOrder = async (data) => {
    try {
        const response = await apiClient.post('/order/', data);
        return response.data;
    } catch (error) {
        console.error('Error fetching products:', error);
        throw error;
    }
};

export const updateOrder = async (order_id , data) => {
    try {
        const response = await apiClient.patch('/order/' + order_id + "/", data);
        return response.data;
    } catch (error) {
        console.error('Error fetching products:', error);
        throw error;
    }
};

export const addItemToOrder = async (data) => {
    try {
        const response = await apiClient.post('/order-items/', data);
        return response.data;
    } catch (error) {
        console.error('Error adding item:', error);
        throw error;
    }
}

export const updateItemQuantity = async (product) => {
    try {
        const response = await apiClient.patch('/order-items/' + product['order_id'] + '/', product)
        return response.statusText
    } catch (error) {
        console.error('Error modifiying order:', error);
        throw error;
    }
}

