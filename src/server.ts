import express = require('express')
import morgan = require('morgan')
import { MetricsHandler } from './metrics'
import bodyparser = require('body-parser')
import session = require('express-session')
import levelSession = require('level-session-store')
import { UserHandler, User } from './user'


const userRouter = express.Router()
const dbUser: UserHandler = new UserHandler('./db/users')
const authRouter = express.Router()
const LevelStore = levelSession(session)
const app = express()
const metricsHandler = new MetricsHandler("./db")
app.use(bodyparser.json())
app.use(bodyparser.urlencoded())
app.use(morgan('dev'))
app.use(session({
  secret: 'my very secret phrase',
  store: new LevelStore('./db/sessions'),
  resave: true,
  saveUninitialized: true
}))
app.use(authRouter)
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

authRouter.get('/login', (req: any, res: any) => {
  res.render('login')
})

authRouter.get('/signup', (req: any, res: any) => {
  res.render('signup')
})

authRouter.get('/logout', (req: any, res: any) => {
  delete req.session.loggedIn
  delete req.session.user
  res.redirect('/login')
})

app.post('/login', (req: any, res: any, next: any) => {
  dbUser.get(req.body.username, (err: Error | null, result?: User) => {
    if (err) next(err)
    if (result === undefined || !result.validatePassword(req.body.password)) {
      res.redirect('/login')
    } else {
      req.session.loggedIn = true
      req.session.user = result
      res.redirect('/')
    }
  })


  userRouter.post('/', (req: any, res: any, next: any) => {
    dbUser.get(req.body.username, function (err: Error | null, result?: User) {
      if (!err || result !== undefined) {
       res.status(409).send("user already exists")
      } else {
        dbUser.save(req.body, function (err: Error | null) {

if (err) next(err)

else res.status(201).send("user persisted")
        })
      }
    })
  })

  userRouter.get('/:username', (req: any, res: any, next: any) => {
    dbUser.get(req.params.username, function (err: Error | null, result?: User) {
      if (err || result === undefined) {
        res.status(404).send("user not found")
      } else res.status(200).json(result)
    })
  })

  app.use('/user', userRouter)
})

const authCheck = function (req: any, res: any, next: any) {
  if (req.session.loggedIn) {
    next()
  } else res.redirect('/login')
}

app.get('/', authCheck, (req: any, res: any) => {
  res.render('index', { name: req.session.username })
})