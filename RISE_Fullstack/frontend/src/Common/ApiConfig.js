// Centralized API configuration with environment variables
const API_BASE_URL = process.env.REACT_APP_BACKEND || 'http://localhost:3200';
const ARES_API_URL = process.env.REACT_APP_ARES_API_URL || 'http://localhost:5000/process_query';
const REGRESSION_API_URL = process.env.REACT_APP_REGRESSION_API_URL || 'http://localhost:5002/temp_thickness';

// Generate full API endpoints
const API = {
    // Auth endpoints
    AUTH: {
        TOKEN: `${API_BASE_URL}/token`,
        VERIFY_TOKEN: `${API_BASE_URL}/verify-token`,
        LOGIN: `${API_BASE_URL}/login`,
        REGISTER: `${API_BASE_URL}/register`,
        LOGOUT: `${API_BASE_URL}/logout`,
    },

    // Dashboard
    DASHBOARD: `${API_BASE_URL}/dashboard`,

    // Projects
    PROJECTS: {
        GET_ALL: `${API_BASE_URL}/allProjects`,
        CREATE: `${API_BASE_URL}/addProject`,
        DETAILS: `${API_BASE_URL}/projectDetails`,
        UPDATE: `${API_BASE_URL}/updateProject`,
        ADD_USERS: `${API_BASE_URL}/addProjectUsers`,
        DELETE_IMAGE: `${API_BASE_URL}/deleteImage`,
        GET_IMAGES: `${API_BASE_URL}/getAllImages`,
    },

    // Instruments
    INSTRUMENTS: {
        GET_ALL: `${API_BASE_URL}/getinstruments`,
        UPDATE: `${API_BASE_URL}/updateInstruments`,
        ADD_USERS: `${API_BASE_URL}/addInstrumentUsers`,
    },

    // Storage
    STORAGE: {
        GET_ALL: `${API_BASE_URL}/getStorage`,
        ADD: `${API_BASE_URL}/addStorage`,
        UPDATE: `${API_BASE_URL}/updateStorage`,
        UPDATE_METADATA: `${API_BASE_URL}/bucket_metadata`,
        ADD_USERS: `${API_BASE_URL}/addStorageUsers`,
    },

    // Images
    IMAGES: {
        UPLOAD: `${API_BASE_URL}/upload`,
        SHOW: `${API_BASE_URL}/showImage`,
        ANALYZE: `${API_BASE_URL}/analyzeImage`,
        SCAN: `${API_BASE_URL}/scanButton`,
        INSTRUMENT_SCAN: `${API_BASE_URL}/semScan`,
    },

    // S3
    S3: {
        GET_BUCKETS: `${API_BASE_URL}/allstorage`,
        IMAGE_DETAILS: `${API_BASE_URL}/imagedetails`,
    },

    // SEM
    SEM: {
        INPUT: `${API_BASE_URL}/sem-input`,
    },

    // Chatbot APIs
    CHATBOT: {
        ARES: ARES_API_URL,
        REGRESSION: REGRESSION_API_URL,
    }
};

export default API;
