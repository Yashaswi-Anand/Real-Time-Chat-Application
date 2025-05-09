module.exports = {

    async registerUser(req, res, next) {
        try {
            // const new_users_added = await prisma.users.create({
            //     data: {
            //         name: req.body.name,
            //         phone_no: req.body.phone_no,
            //         company_id: +req.company_id,
            //         role: req.body.role
            //     }
            // })
            // serverResponses.successResponse(res, "User Added Successfully", new_users_added)
        }
        catch (error) {
            serverResponses.errorResponse(res, error.message, 'unable to register user')
        }
    },

    async loginUser(req, res, next) {
        try {
            // const new_users_added = await prisma.users.create({
            //     data: {
            //         name: req.body.name,
            //         phone_no: req.body.phone_no,
            //         company_id: +req.company_id,
            //         role: req.body.role
            //     }
            // })
            // serverResponses.successResponse(res, "User Added Successfully", new_users_added)
        }
        catch (error) {
            serverResponses.errorResponse(res, error.message, 'unable to register user')
        }
    },
    
}