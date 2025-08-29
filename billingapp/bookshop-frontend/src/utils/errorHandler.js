import toast from 'react-hot-toast';

export const handleApiError = (error, customMessage = null) => {
  console.error('API Error:', error);
  
  let errorMessage = customMessage || 'An unexpected error occurred';
  
  if (error.code === 'ECONNREFUSED' || error.code === 'NETWORK_ERROR') {
    errorMessage = 'Unable to connect to server. Please check if the backend is running.';
  } else if (error.response) {
    const { status, data } = error.response;
    
    switch (status) {
      case 400:
        errorMessage = data || 'Bad request. Please check your input.';
        break;
      case 401:
        errorMessage = 'Authentication failed. Please login again.';
        // Clear auth data
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = '/login';
        break;
      case 403:
        errorMessage = 'Access denied. You do not have permission to perform this action.';
        break;
      case 404:
        errorMessage = 'Resource not found.';
        break;
      case 409:
        errorMessage = data || 'Conflict. Resource already exists.';
        break;
      case 422:
        errorMessage = data || 'Validation error. Please check your input.';
        break;
      case 500:
        errorMessage = 'Server error. Please try again later.';
        break;
      case 503:
        errorMessage = 'Service unavailable. Please try again later.';
        break;
      default:
        errorMessage = data || `Server error (${status}). Please try again.`;
    }
  } else if (error.request) {
    errorMessage = 'No response from server. Please check your internet connection.';
  }
  
  toast.error(errorMessage);
  return errorMessage;
};

export const handleApiSuccess = (message, data = null) => {
  if (message) {
    toast.success(message);
  }
  return { success: true, data, message };
};

export const isNetworkError = (error) => {
  return error.code === 'ECONNREFUSED' || 
         error.code === 'NETWORK_ERROR' || 
         !error.response;
};

export const isServerError = (error) => {
  return error.response && error.response.status >= 500;
};

export const isClientError = (error) => {
  return error.response && error.response.status >= 400 && error.response.status < 500;
};
