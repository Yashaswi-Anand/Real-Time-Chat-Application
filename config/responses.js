module.exports = {
     
    async errorResponse(res,error, error_message){
        res.status(400).send({
            data: null,
            message: error_message,
            code: 400,
            error: error
        });
    },
     
    async successResponse(res,message, data=null){
        res.status(200).send({
            data: data,
            message: message,
            code: 200,
            error: null
        })
    },
}