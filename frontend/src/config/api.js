const API_BASE_URL = process.env.NODE_ENV === 'production'
    ? 'http://localhost:8090'  // Your local backend URL
    : 'http://localhost:8090'; // Development backend URL

export const API_ENDPOINTS = {
    base: API_BASE_URL,
    auth: `${API_BASE_URL}/auth`,
    pets: `${API_BASE_URL}/pet`,
    appointments: `${API_BASE_URL}/api/appointments`,
    medical: `${API_BASE_URL}/medical`,
    product: `${API_BASE_URL}/product`,
    order: `${API_BASE_URL}/order`,
    employee: `${API_BASE_URL}/employee`,
    petAd: `${API_BASE_URL}/pet-ad`,
    expenses: `${API_BASE_URL}/api/expenses`,
    gemini: `${API_BASE_URL}/gemini`,
    feedback: `${API_BASE_URL}/feedback`,
    notifications: `${API_BASE_URL}/api/notifications`
};

export default API_ENDPOINTS; 