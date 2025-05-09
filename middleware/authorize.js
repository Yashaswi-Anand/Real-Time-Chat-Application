const jwt = require("jsonwebtoken");
const util = require("../config/utils");

function authorize() {

    return async (req, res, next) => {
        var idToken = req.headers.authorization

        if (!idToken) {
            res.status(401).send({
                data: null,
                message: 'Unauthorized, not authorized to use this API',
                status: 401,
                error: "Unauthorized"
            });
            return
        }
        idToken = req.headers.authorization.split(" ")[1]
        if (!idToken) {
            res.status(401).send({
                data: null,
                message: 'Unauthorized, not authorized to use this API',
                status: 401,
                error: "Unauthorized"
            });
            return
        }

        jwt.verify(idToken, process.env.TOKEN, async(err, decoded) => {
            if (err) {
                return res.status(401).json({ message: "Not authorized" })
            } else {
                try {
                    req.user_id = decoded.id;
                    req.name = decoded.name;
                    req.email = decoded.email;
                    return next();
                } catch (error) {
                    res.status(401).send({
                        data: null,
                        message: "Unauthorized, not authorized to use this API",
                        status: 401,
                        error: "Unauthorized"
                    });
                }
            }
        })
    }
}

module.exports = authorize;