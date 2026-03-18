const dotenv =require('dotenv')

dotenv.config({path :'../../.env'})


const jwt = require('jsonwebtoken');

const generateToken = (id) => {
    if (!process.env.JWT_SECRET) {
        throw new Error("JWT_SECRET is not set in .env");
    }

    return jwt.sign(
        { id },
        process.env.JWT_SECRET,
        { expiresIn: "10m" }
    );
};

module.exports = generateToken;