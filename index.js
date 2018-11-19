// // ./index.js
// const http = require('http')
// const handles = require('./handles')
// const server = http.createServer(handles.serverHandle);
// server.listen(8080)



//express

const defaultContent = '<p style="text-align: center;">Hi everyone</p>'
+'<p style="text-align: center;">This application lets you display the name of anyone.</p>'
+'<p style="text-align: center;">You will have more details if you try with "<em>Michael</em>"</p>'
+'<p style="text-align: center;">Enjoy !</p>'

const nameContent = '<p style="text-align: center;">Bonjour, je m\'appelle Michael.</p>'
+'<p style="text-align: center;">Je suis &eacute;tudiant en 5e ann&eacute;e &agrave; l\'ECE Paris.</p>'
+'<p style="text-align: center;">J\'aime l\'informatique, l\'aventure et pratique le short track</p>'
+'<p style="text-align: center;">&Agrave; bient&ocirc;t !</p>'

express = require('express')
app = express()


app.set('port', 1337)

app.listen(
  app.get('port'), 
  () => console.log(`server listening on ${app.get('port')}`)
)

app.get('/', function (req, res) {
    res.status(200).send(defaultContent);
})

app.get('/hello/:name', function (req, res) {
    name = req.params.name;
    if (name === "michael" || name === "Michael")
        res.status(200).send(nameContent);
    else
        res.status(200).send('Hello ' + name);
    res.end();

})

app.get('*', function (req, res) {
    res.status(404).send('Sorry cant find that! Error 404');
})
