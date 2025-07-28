export const BASE_URL = 'http://localhost:5000/api/v1';

export const API_PATHS = {
    AUTH: {
        REGISTER: '/auth/signup',
        LOGIN: '/auth/signin',
        GET_PROFILE: '/auth/profile',
    },
    USERS: {
        GET_ALL_USERS: '/users',
        GET_USER_BY_ID: (id) => `/users/${id}`,
        CREATE_USER: 'uer'
    }

}