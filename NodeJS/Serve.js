const express = require('express')

const app = express()

dist = ""

app.get('/:data', (req, res) => {
    dist = req.params.data
    res.send('Recibido')
    console.log(dist)
})

app.listen(80, () => {
    console.log("Running")
})