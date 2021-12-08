const jwt = require('jsonwebtoken');
require('dotenv').config();

exports.auth = (req, res, next) => {
    const token = req.headers['authorization'];

    if (!token) {
        return res.status(401).send({
            errors: [
                {
                    msg: 'Access denied. No token provided.'
                }
            ]
        });
    }

    try {
        user = jwt.verify(token, 'secret');
        req.user = user;
        next();
    } catch (error) {
        res.status(401).json({ errors: [{ msg: 'invalid token' }] });
    }
};
