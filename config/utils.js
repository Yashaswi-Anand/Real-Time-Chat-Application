const jwt = require("jsonwebtoken");

module.exports = {

    async generateJwtToken(user_data) {
        return jwt.sign({
            id: user_data.id,
            name: user_data.name,
            email: user_data.email
        }, process.env.TOKEN, { expiresIn: '1h' });
    },

    async generateRefreshToken(user_data) {
        return jwt.sign({
            user_id: user_data.id,
        }, process.env.REFRESH_TOKEN_SECRET, { expiresIn: '24h' });
    },

}