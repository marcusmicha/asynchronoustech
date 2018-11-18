// ./index.js
// const http = require('http')
// const handles = require('./handles')
// const server = http.createServer(handles.serverHandle);
// server.listen(8080)

//express

express = require('express')
app = express()

path = require('path')
app.use(express.static(path.join(__dirname, 'public')))

app.set('port', 1337)
app.set('views', __dirname + "/views")
app.set('view engine', 'ejs');
const metrics = require('./metrics')

app.listen(
  app.get('port'), 
  () => console.log(`server listening on ${app.get('port')}`)
)

app.get('/', function (req, res) {
  // GET
})

app.get('/metrics.json', (req, res) => {
    metrics.get((err, data) => {
      if(err) throw err
      res.status(200).json(data)
    })
  })

app.get(
    '/hello/:name', 
    (req, res) => res.render('hello.ejs', {name: req.params.name})
  )

app.post('/', (req, res) => {
  // POST
})

app
  .put('/', function (req, res) {
    // PUT
  })
  .delete('/', (req, res) => {
    // DELETE
  })