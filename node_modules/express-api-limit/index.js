const defaults = require('defaults')

function ipLimiter(options) {

    options = defaults(options, {
        ipAddress: '::'
    })

    return function (req, res, next) {

        if (!req.ip.includes(options.ipAddress)) {
            console.log(req.ip)
            return res.json({
                message: 'An Error Occured'
            })
        } else {
            next()
        }
    }
}

module.exports = {
    ipLimiter
};