const express = require('express')
const app = express()

app.get('/', (req, res) => res.send('Hello World!'))

app.get('/index.html', (req, res) => res.send(index.html))

app.listen(3000, () => console.log('Example app listening on port 3000!'))
