import axios from 'axios'
import API from './ApiConfig'

const generateToken = async (user) => {
    let config = {
        method: 'post',
        url: API.AUTH.TOKEN,
        headers: {
            'Content-Type': 'application/json',
        },
        data: JSON.stringify({
            "email": user.email
        })
    };
    const response = await axios.request(config)
    return response.data;
}

const verifyToken = async (user) => {
    let config = {
        method: 'post',
        url: API.AUTH.VERIFY_TOKEN,
        headers: {
            'Content-Type': 'application/json',
        },
        data: JSON.stringify({
            "token": user.token
        })
    };
    const response = await axios.request(config)
    return response.data;
}

export { generateToken, verifyToken }