// Add this function to your existing index.js file
async function testAPI() {
  try {
    // Using relative URL which automatically points to your own domain
    const response = await fetch('/api/health', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    });
    
    const data = await response.json();
    console.log('API Response:', data);
    alert('API Test Successful: ' + JSON.stringify(data));
    return data;
  } catch (error) {
    console.error('API Test Failed:', error);
    alert('API Test Failed: ' + error.message);
    return null;
  }
}