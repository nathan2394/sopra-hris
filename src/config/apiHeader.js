const apiHeaders = () => {
    try {
        const userToken = localStorage.getItem('userToken');
        return {
            'Authorization': `Bearer ${userToken}`
      }
    } catch (e) {
        console.log(e);
    }
}
  
export default apiHeaders;