var express = require('express')
var cors = require('cors')

var app = express()
app.use(cors())

app.get('/:salon/:tag', (req, res) => {
    var salon = req.params.salon
    var tag = req.params.tag

    console.log('Salon enviado: ' + salon)
    console.log('Estudiante: ' + tag)

    res.send('Usaka-Tarde')
})

app.get('/:algo', (req, res) => {
    console.log(req.params.algo)
    res.sendFile(__dirname + '/static/index.html')
})

app.get('/profesores/:profesor', (req, res) => {
    const objetourl = url.parse(pedido.url)
    let camino = 'static' + objetourl.pathname
    if (camino == 'static/')
        camino = 'static/index.html'
    fs.stat(camino, error => {
        if (!error) {
            fs.readFile(camino, (error, contenido) => {
                if (error) {
                    respuesta.writeHead(500, { 'Content-Type': 'text/plain' })
                    respuesta.write('Error interno')
                    respuesta.end()
                } else {
                    respuesta.writeHead(200, { 'Content-Type': 'text/html' })
                    respuesta.write(contenido)
                    respuesta.end()
                }
            })
        } else {
            respuesta.writeHead(404, { 'Content-Type': 'text/html' })
            respuesta.write('<!doctype html><html><head></head><body>Recurso inexistente</body></html>')
            respuesta.end()
        }
    })
})

app.listen(80, () => {
    console.log('Servidor web iniciado')
})