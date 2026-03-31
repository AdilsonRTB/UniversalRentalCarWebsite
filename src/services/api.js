import axios from 'axios'


const AUTH_API_BASE_URL = '/api/vehicle-rental/api'
//const AUTH_API_BASE_URL = 'http://127.0.0.1:8000/'
/*
const api = axios.create({
  baseURL: AUTH_API_BASE_URL + 'vehicle-rental/api',
  headers: {
    'Accept': 'application/json',
    //'X-CSRFTOKEN': '3HjHcN6PspN8XYqcMFXiq6SF3C7FeJztlWyXP2RL0hfgVfZ6SZz3mHn61aZBk9N4'
  }
})*/

const api = axios.create({
  baseURL: '/api/vehicle-rental/api',
  headers: {
    'Accept': 'application/json',
    //'X-CSRFTOKEN': '3HjHcN6PspN8XYqcMFXiq6SF3C7FeJztlWyXP2RL0hfgVfZ6SZz3mHn61aZBk9N4'
  }
})


// Interceptor para tratar respostas
api.interceptors.response.use(
  response => response,
  error => {
    // Não redirecionar em rotas de autenticação (login, register, etc.)
    const url = error.config?.url || ''
    const isAuthRoute = url.includes('/login') || url.includes('/register')
    
    if (error.response?.status === 401 && !isAuthRoute) {
      localStorage.removeItem('authToken')
      localStorage.removeItem('userRole')
    }
    return Promise.reject(error)
  }
)

export const authService = {
  login: (credentials) => api.post('/customer/login/', credentials),
  register: (userData) => api.post('/customer/register/', userData),
  updateProfile: (userData) => api.patch('/customer/register/update_profile', userData, {
    headers: {'Authorization': `Token ${localStorage.getItem('authToken')}`}
  }),
  me: () => api.get('/customer/register/me/', {
    headers: {'Authorization': `Token ${localStorage.getItem('authToken')}`}
  }),
  allCustomers: () => api.get('/customers/'),
  createCustomer: (customerData) => api.post('/customers/', customerData),
  updateCustomer: (id, customerData) => api.put(`/customers/${id}/`, customerData),
  logout: () => {
    localStorage.removeItem('authToken')
    //localStorage.removeItem('userRole')
  },
  forgotPassword: (email) => api.post('/customer/request-password-reset/', { email }),
  resetPassword: (email, otp, newPassword, confirmPassword) => api.post('/customer/reset-password/', { email: email, otp: otp, new_password: newPassword, confirm_password: confirmPassword }),
  changePassword: (customer_id, current_password, new_password, confirm_password) => api.post('/customer/change-password/', { customer_id, current_password, new_password, confirm_password }, {
    headers: {'Authorization': `Token ${localStorage.getItem('authToken')}`}
  }),
}

/*export const userService = {
  getProfile: () => api.get('/users/profile'),
  updateProfile: (userData) => api.put('/users/profile', userData),
  getAllUsers: () => api.get('/users'),
  getUserById: (id) => api.get(`/users/${id}`),
  //createUser: (userData) => api.post('/customer/register/', userData),
  updateUser: (id, userData) => api.put(`/users/${id}`, userData),
  deleteUser: (id) => api.delete(`/users/${id}`),
  ///login: (credentials) => api.post('/accounts/login/', credentials)
}*/

export const vehicleService = {
  getAllVehicles: () => api.get('/vehicles/'),
  getVehicleById: (id) => api.get(`/vehicles/${id}/`),

  getVehicleEvaluations: (vehicleId) => api.get(`/vehicles/${vehicleId}/evaluations/`),
  createVehicleEvaluations: (evaluationData) => api.post(`/customer/evaluations/`, evaluationData, {
    headers: {'Authorization': `Token ${localStorage.getItem('authToken')}`}
  }),

  getEvaluationsStats: () => api.get(`/vehicle-rental/api/evaluations/statistics/`),
  getAllEvaluations: () => api.get('/evaluations/'),
  getAllVehiclesBrands: () => api.get('/customer/vehicle-brands/'),
  getAllLocations: () => api.get('/delivery-locations/'),
  getSystemConfig: () => api.get('/system-config/'),
  getNotifications: (id) => api.get(`/customer/${id}/notifications/`, {
    headers: {'Authorization': `Token ${localStorage.getItem('authToken')}`}
  }),

}

export const bookingService = {
  /*getAllBookings: () => api.get('/bookings'),
  getBookingById: (id) => api.get(`/bookings/${id}`),
  getBookingsByClient: (clientId) => api.get(`/bookings/client/${clientId}`),
  getBookingsByVehicle: (vehicleId) => api.get(`/bookings/vehicle/${vehicleId}`),
  checkVehicleAvailability: (vehicleId, startDate, endDate) =>
    api.get(`/bookings/vehicle/${vehicleId}/availability`, {
      params: { startDate, endDate }
    }),*/
  createBooking: (bookingData) => api.post('/rentals/', bookingData),
  getBookingsByCustomer: () => api.get(`/customer/rentals/`, {
    headers: {'Authorization': `Token ${localStorage.getItem('authToken')}`}
  }),
  getRentalDetails: (rentalId, email) => api.post(`/customer/rental-details/`, {
    rental_number: rentalId,
    email: email
  }),
  //updateBooking: (id, bookingData) => api.put(`/bookings/${id}`, bookingData),
  //updateBookingStatus: (id, status) => api.patch(`/bookings/${id}/status`, null, { params: { status } }),
  //deleteBooking: (id) => api.delete(`/bookings/${id}`)
}

export const baseURL = AUTH_API_BASE_URL || '/api/vehicle-rental/api'

export default api

