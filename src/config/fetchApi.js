import axios from 'axios';
import { useCallback, useContext } from 'react';
import { AuthContext } from '../context/authContext';

export const useAPI = () => {
    const { logout } = useContext(AuthContext);
    const userToken = localStorage.getItem('userToken'); // Fetch inside function
    const api_endpoint = 'https://sopra-hris.mixtra.co.id';

    const loadData = useCallback(async ({ url, params = [] }) => {

        let paramsUrl = '';
        try {
            if(params.length > 0) {
                paramsUrl = '?';
                params.map((item, index) => {
                    const value = encodeURIComponent(typeof item.value === 'string' ? item.value.trim() : item.value);
                    paramsUrl += item.title + '=' + value + (index === params.length - 1 ? '' : '&');
                });
            }
        } catch(err) {
            console.log(err);
        }
        
        try {
            const result = await axios.get(`${api_endpoint}/${url}${paramsUrl}`, {
                headers: {
                    'Authorization': `Bearer ${userToken}`,
                },
            });
            return Promise.resolve(result.data);
        } catch (err) {
            if(err.response && err.response.status === 401){
                logout();
            }else{
                console.log(err);
            }
            return {
                status: err.status,
                response: err.response
            }
        }
    }, [userToken]);

    const postData = useCallback(async ({url, formData = null}) => {

        try {
            const response = await axios.post(`${api_endpoint}/${url}`, formData, {
                headers: {
                    'Authorization': `Bearer ${userToken}`,
                },
            });
            return response.data;
        } catch (error) {
            console.error('Error while posting data:', error);
            // throw error;
            return {
                status: error.status,
                response: error.response
            }
        }
    }, [userToken]);

    const postFormData = useCallback(async ({url, formData = null}) => {

        try {
            const response = await axios.post(`${api_endpoint}/${url}`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data', // Ensure proper content type
                    'Authorization': `Bearer ${userToken}`
                },
            });
            return response.data;
        } catch (error) {
            console.error('Error while posting data:', error);
            // throw error;
            return {
                status: error.status,
                response: error.response
            }
        }
    }, [userToken]);

    const updateData = useCallback(async ({ url, formData = null }) => {

        try {
            const response = await axios.put(`${api_endpoint}/${url}`, formData, {
                headers: {
                    'Authorization': `Bearer ${userToken}`,
                },
            });
            return response.data;
        } catch (error) {
            console.error('Error while posting data:', error);
            // throw error;
            return {
                status: error.status,
                response: error.response
            }
        }
    }, [userToken])

    const deleteData = useCallback(async ({ url, id }) => {
        try {
            let res;
            res = await axios.delete(`${api_endpoint}/${url}/${id}`, {
                headers: {
                    'Authorization': `Bearer ${userToken}`,
                },
            });

            return res.data;
        } catch (err) {
            throw err.response.data?.message;
        }
    }, [userToken])

    return { loadData, postData, postFormData, updateData, deleteData };
}