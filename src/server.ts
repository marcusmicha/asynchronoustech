import express = require('express')
import { MetricsHandler } from './metrics'
import bodyparser = require('body-parser')



const app = express()
const metricsHandler = new MetricsHandler("./db")
app.use(bodyparser.json())
app.use(bodyparser.urlencoded())
const port: string = process.env.PORT || '8080'


app.listen(port, (err: Error) => {
  if (err) {
    throw err
  }
  console.log(`server is listening on port ${port}`)
})
app.get('/', (req: any, res: any) => {
  res.write('Hello world')
  res.end()
})

app.get('/metrics/:key', (req: any, res: any) => {
  metricsHandler.get(req.params.key,(err: Error | null, result?: any) => {
    if (err) {
      throw err
    }
    res.json(result)
  })
})

app.post('/metrics/:key', (req: any, res: any) => {
  console.log(req.body)
  metricsHandler.save(req.params.key,req.body,(err: Error | null, result?: any) => {
    if(err) throw err
    console.log('success')
  })
})

app.delete('/metrics/:key', (req: any, res: any) => {
  metricsHandler.delete(req.params.key,(err: Error | null, result?: any) => {
    if(err) throw err
    res.json(result)
  })
})