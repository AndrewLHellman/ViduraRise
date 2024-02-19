import axios from 'axios'

const generateToken = async (user) => {
    let config = {
        method: 'post',
        url: 'http://localhost:3200/token',
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
        url: 'http://localhost:3200/verify-token',
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