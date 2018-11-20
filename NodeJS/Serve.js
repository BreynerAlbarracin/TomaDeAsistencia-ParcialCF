var express = require('express')
var cors = require('cors')
var mongo = require('mongodb').MongoClient
var qr = require('qr-image')
var url = "mongodb://localhost:27017/"
var lastReq = "";

var app = express()
app.use(cors())

app.get('/test', (req, res) => {
    console.log(req.params.algo)
    res.sendFile(__dirname + '/public/index.html')
})

app.get('/restaurarAsistencia', (req, res) => {
    mongo.connect(url, { useNewUrlParser: true }, (err, connection) => {
        if (err) {
            throw err
        }

        var db = connection.db('dbuniversidad')

        db.collection('estudiantes').updateMany({}, { $set: { 'clases.$[].preregistro': 0 } }, (err, result) => {
            console.log('Asistencia restaurada')
        })

        db.collection('estudiantes').updateMany({}, { $set: { 'clases.$[].codigo': '' } }, () => {
            console.log('Codigos restaurados')
        })

        res.send('Asistencia restaurada')
    })
})

app.get('/salon/:salon', (req, res) => {
    var salon = req.params.salon

    if (isNaN(salon)) {
        console.log('Recurso solicitado: ' + salon)
        res.sendFile(lastReq + salon)
        return
    }

    console.log('Peticion desde salon: ' + salon)
    var date = new Date()
    var time = (date.getHours() * 100) + date.getMinutes()
    console.log('Hora de peticion: ' + time)
    var nombreClase = ""

    mongo.connect(url, { useNewUrlParser: true }, (err, connection) => {
        if (err) {
            throw err
        }

        var db = connection.db('dbuniversidad')

        db.collection('estudiantes').find({}).toArray((err, results) => {
            if (err) {
                throw err
            }

            results.forEach((result) => {
                result.clases.forEach((clase) => {
                    if (salon == clase.salon) {
                        if (clase.horainicio <= time && time <= clase.horafinal) {
                            nombreClase = clase.nombre
                            console.log('Clase determinada: ' + nombreClase + ', ' + clase.id)

                            var qrText = nombreClase + '-' + date.getSeconds()
                            let camino = __dirname + '/public/' + salon + '/'
                            lastReq = camino

                            console.log('Generando nuevo QR: ' + qrText)

                            var qr_svg = qr.image(qrText, { type: 'png' });
                            qr_svg.pipe(require('fs').createWriteStream(camino + 'qr_image.png'));
                            var svg_string = qr.imageSync(qrText, { type: 'png' });

                            db.collection('estudiantes').updateMany({}, { $set: { 'clases.$[elemt].codigo': qrText } }, { arrayFilters: [{ 'elemt.id': clase.id }] }, () => {
                                console.log('Enviado QR desde: ' + camino)
                                res.sendFile(camino + 'qr.html')
                            })
                        }
                    }
                })
            })

            if (nombreClase == "") {
                lastReq = __dirname + '/public/';
                res.sendFile(__dirname + '/public/fueraTiempo.html')
            }
        })
    })
})

app.get('/app/login/:user/:pass', (req, res) => {
    var userR = req.params.user
    var passR = req.params.pass

    console.log('Usuario detectado: ' + userR)
    console.log('Contraseña determinada: ' + passR)

    mongo.connect(url, { useNewUrlParser: true }, (err, connection) => {
        if (err) {
            throw err
        }

        db = connection.db('dbuniversidad')

        var user = db.collection('estudiantes').findOne({ user: userR, pass: passR }, (err, result) => {
            if (err) {
                throw err
            }

            console.log(result)

            if (result == null) {
                res.send('0')
            } else {
                res.send(result._id + '')
            }
        })
    })
})

app.get('/app/:idUser', (req, res) => {
    var idUser = req.params.idUser


})

app.get('/:salon/:tag', (req, res) => {
    console.log('--------------------REGISTRO NUEVO--------------------')

    var salon = req.params.salon
    var tag = req.params.tag

    console.log('Salon Consultado: ' + salon)
    console.log('Estudiante: ' + tag)

    mongo.connect(url, { useNewUrlParser: true }, (err, db) => {
        if (err) {
            res.send(300)
            throw err
        }
        var dbo = db.db("dbuniversidad")
        var query = { carnet: tag }
        dbo.collection("estudiantes").find(query).toArray(function (err, result) {
            if (err) {
                db.close()
                throw err
            }

            if (result[0]) {
                console.log('Estudiante registrado: ' + result[0]._id)

                var date = new Date()
                var haveClass = false

                var i = 0
                while (result[0].clases[i]) {
                    console.log(result[0].clases[i].nombre)

                    if (result[0].clases[i].salon == salon) {
                        haveClass = true
                        break
                    }
                    i++
                }

                var estado = "Salon Erroneo"

                if (haveClass) {
                    var tiempo = (date.getHours() * 100) + date.getMinutes()

                    console.log('Hora de clase: ' + result[0].clases[i].horainicio)
                    console.log('Hora de registro: ' + tiempo)

                    if (result[0].clases[i].horainicio <= tiempo && tiempo <= result[0].clases[i].horafinal) {
                        if ((result[0].clases[i].horainicio + 15) >= tiempo) {
                            estado = 'Registro Listo'

                            query = { _id: result[0]._id, "clases.salon": result[0].clases[i].salon }
                            values = { $set: { "clases.$.preregistro": 1 } }
                            dbo.collection("estudiantes").updateOne(query, values, function (err, res) {
                                if (err) {
                                    db.close()
                                    throw err
                                } else {
                                    db.close()
                                    console.log("Preregistro actualizado")
                                }
                            })
                        } else {
                            estado = 'Llegas Tarde'
                            db.close()
                        }
                    } else {
                        estado = 'Fuera De Tiempo'
                        db.close()
                    }
                }

                console.log('Estado del estudiante: ' + estado)

                res.send(result[0].nombre + ' ' + result[0].apellido + '-' + estado)
                //db.close()
            } else {
                res.send('Error De-Tarjeta')
                db.close()
            }
        })
    })
})

app.listen(80, () => {
    console.log('Servidor web iniciado')
})