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

export const creatSalon = async (data)=>{
    try {
        const response = await apiClient.post('/salons/',data);
        return response.data;
    } catch (error) {
        console.log(error);
        throw error;
    }
}

export const creatTable = async (data)=>{
    try {
        const response = await apiClient.post('/tables/',data);
        return response.data;
    } catch (error) {
        console.log(error);
        throw error;
    }
}