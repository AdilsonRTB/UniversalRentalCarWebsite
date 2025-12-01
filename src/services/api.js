import axios from 'axios'

const AUTH_API_BASE_URL = 'http://84.247.171.243:8090'

const api = axios.create({
  baseURL: AUTH_API_BASE_URL + '/vehicle-rental/api',
  headers: {
    'Accept': 'application/json',
    //'X-CSRFTOKEN': '3HjHcN6PspN8XYqcMFXiq6SF3C7FeJztlWyXP2RL0hfgVfZ6SZz3mHn61aZBk9N4'
  }
})


// Interceptor para adicionar token de autenticação
/*api.interceptors.request.use(
  config => {
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  error => {
    return Promise.reject(error)
  }
)*/

// Interceptor para tratar respostas
api.interceptors.response.use(
  response => response,
  error => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token')
      localStorage.removeItem('userRole')
      window.location.href = '/login'
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
  me: () => api.get('/customer/register/me', {
    headers: {'Authorization': `Token ${localStorage.getItem('authToken')}`}
  }),
  allCustomers: () => api.get('/customers'),
  createCustomer: (customerData) => api.post('/customers/', customerData),
  updateCustomer: (id, customerData) => api.put(`/customers/${id}/`, customerData),
  logout: () => {
    localStorage.removeItem('authToken')
    //localStorage.removeItem('userRole')
  }
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
  getVehicleById: (id) => api.get(`/vehicles/${id}`),

  getVehicleEvaluations: (vehicleId) => api.get(`/vehicles/${vehicleId}/evaluations`),
  createVehicleEvaluations: (evaluationData) => api.post(`/customer/evaluations/`, evaluationData, {
    headers: {'Authorization': `Token ${localStorage.getItem('authToken')}`}
  }),
  /*getVehiclesByOwner: (ownerId) => api.get(`/vehicles/owner/${ownerId}`),
  getAvailableVehicles: () => api.get('/vehicles/available'),
  getPromotionalVehicles: () => api.get('/vehicles/promotional'),
  getOwners: () => api.get('/vehicles/owners'),
  searchVehicles: (params) => api.get('/vehicles/search', { params }),
  createVehicle: (vehicleData) => api.post('/vehicles', vehicleData),
  updateVehicle: (id, vehicleData) => api.put(`/vehicles/${id}`, vehicleData),
  updateAvailability: (id, available) => api.patch(`/vehicles/${id}/availability`, null, { params: { available } }),
  deleteVehicle: (id) => api.delete(`/vehicles/${id}`)*/

  getEvaluationsStats: () => api.get(`/vehicle-rental/api/evaluations/statistics/`)

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
  getRentalDetails: (rentalId) => api.get(`/rentals/${rentalId}/`),
  //updateBooking: (id, bookingData) => api.put(`/bookings/${id}`, bookingData),
  //updateBookingStatus: (id, status) => api.patch(`/bookings/${id}/status`, null, { params: { status } }),
  //deleteBooking: (id) => api.delete(`/bookings/${id}`)
}

export const baseURL = AUTH_API_BASE_URL

export default api

