# What is this?

`Express-api-limiter, is a package that limits a request to an ip`

# Installation

`npm i express-api-limiter`


Then...

```
const iplimiter = require('express-ip-limiter')
const ip = iplimiter.iplimiter({
    ipAddress: '::1' // enter ip you want to limit it to

app.post('/important', ip, (req, res, next) => {
    res.json({
        message: 'success'
    )}
})
```

## Options

* `ipAddress`

