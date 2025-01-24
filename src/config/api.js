import axios from 'axios';

export const loadData = async ({ url, params = [] }) => {
    // const api_endpoint = process.env.API_ENDPOINT;
    const api_endpoint = 'https://sopra-hris.mixtra.co.id';
    //console.log(api_endpoint)
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
        const result = await axios.get(`${api_endpoint}/${url}${paramsUrl}`)
        return Promise.resolve(result.data);
    } catch (err) {
        console.error(Promise.reject(err));
    }
};

export const postData = async ({url, formData = null}) => {
    const api_endpoint = 'https://sopra-hris.mixtra.co.id';

    try {
        const response = await axios.post(`${api_endpoint}/${url}`, formData, {
            headers: {
            'Content-Type': 'multipart/form-data', // Ensure proper content type
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
};