require('dotenv').config()

const express = require('express')
const api = require('./api')

const app = express()

app.use(express.json())
app.use('/api', api)

app.use('/fe', express.static('../fe'))
app.use('/day3', express.static('../web3'))

const port = process.env.PORT || 3000
app.listen(port, () => console.log(`Server listening at ${port}`))
