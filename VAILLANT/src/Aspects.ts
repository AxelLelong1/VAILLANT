export const aspects = async () =>  {
    try {
      const response = await fetch('http://localhost:8080/api/getAspects', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        }
      });
    
      const data = await response.json();
      console.log(data);
      return data.aspects.slice(' ');
    } catch (error) {
      console.error('Error fetching aspects:', error);
      return [];
    } 
};