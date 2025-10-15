import { apiClient } from "./../apiClient"

export const createCategory = async (category) => {
    try {
        const response = await apiClient.post('/category/', category)
        return response.data;
    } catch (error) {
        throw error;
    }
}

export const featchCategory = async () => {
    try {
        const response = await apiClient.get('/category/')
        return response.data;
    } catch (error) {
        throw error;
    }
}