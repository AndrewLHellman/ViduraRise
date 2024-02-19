const jwt = require('jsonwebtoken');
require("dotenv").config();

const secretKey = process.env.JWT_SECRET;
exports.generate_token = async (req, res) => {
    try {
        const payload = {
            email: req.body.email
        }
        const options = { expiresIn: '1h' }
        const token = jwt.sign(payload, secretKey, options);
        return res.json({
            status: 1,
            msgType: "success",
            msg: 'Token generate successfully !',
            token
        });
    } catch (error) {
        return res.json({
            status: 0,
            msgType: "error",
            msg: `Error message: ${error.toString()}`,
        });
    }
};

exports.verify_token = async (req, res) => {
    const { token } = req.body
    if (!token) {
        return res.status(200).json({
            status: 0,
            message: 'Token not available.'
        });
    }
    jwt.verify(token, secretKey, function (err, decoded) {
        if (err) {
            return res.json({
                status: 2,
                msgType: "error",
                msg: "Token expired."
            });
        }
        return res.json({
            status: 1,
            msgType: "success",
            msg: "Session not expired.",
            data: decoded
        });
    });
};