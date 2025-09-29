class ApiService {
  async makeRequest(url: string, options: RequestInit = {}) {
    const apiKey = import.meta.env.VITE_API_KEY;
    
    return fetch(url, {
      ...options,
      headers: {
        ...options.headers,
        'x-api-key': apiKey,
        'Content-Type': 'application/json'
      }
    });
  }
}

export const apiService = new ApiService();
