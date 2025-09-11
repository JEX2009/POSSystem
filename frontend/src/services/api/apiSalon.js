import {apiClient} from "./../apiClient"

export const featchSalons= async () => {
    try {
        const response = await apiClient.get('/salons/');
        return response.data;
    } catch (error) {
        console.log(error);
        throw error;
    }
}

