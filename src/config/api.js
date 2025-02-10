import axios from 'axios';

export const loadData = async ({ url, params = [] }) => {
    const userToken = localStorage.getItem('userToken'); // Fetch inside function
    const api_endpoint = 'https://sopra-hris.mixtra.co.id';

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
        console.log('User Token:', userToken); // Debugging
        const result = await axios.get(`${api_endpoint}/${url}${paramsUrl}`, {
            headers: {
                'Authorization': `Bearer ${userToken}`,
            },
        });
        return Promise.resolve(result.data);
    } catch (err) {
        console.error(err);
        return {
            status: err.status,
            response: err.response
        }
    }
};


export const postData = async ({url, formData = null}) => {
    const userToken = localStorage.getItem('userToken');
    const api_endpoint = 'https://sopra-hris.mixtra.co.id';

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
};

export const postFormData = async ({url, formData = null}) => {
    const userToken = localStorage.getItem('userToken');
    const api_endpoint = 'https://sopra-hris.mixtra.co.id';

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
};

export const deleteData = async ({ url, id }) => {
    const userToken = localStorage.getItem('userToken');
    const api_endpoint = 'https://sopra-hris.mixtra.co.id';
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
}