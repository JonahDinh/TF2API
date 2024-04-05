import * as bodyParser from 'body-parser'
import { AppDataSource } from './data-source'
import { createExpressServer, useExpressServer } from 'routing-controllers'
import * as createError from 'http-errors'
import WeaponController from './controller/WeaponController'
import MapController from './controller/MapController'
import ClassController from './controller/ClassController'
import { AuthController } from './controller/AuthController'
import * as passport from 'passport'
import { Strategy as SteamStrategy } from 'passport-steam'
import UserController from './controller/UserController'
import * as cookieParser from 'cookie-parser'

// CORS configuration
const corsOptions = {
  origin: /localhost\:\d{4,5}$/i,
  credentials: true,
  allowedHeaders: 'Origin,X-Requested-With,Content-Type,Accept,Authorization',
  methods: 'GET,PUT,POST,DELETE',
  maxAge: 43200
}

// Initialize the data source
AppDataSource.initialize().then(async () => {
  // Create an Express app using routing-controllers
  const app = createExpressServer({
    cors: corsOptions,
    controllers: [WeaponController, MapController, ClassController, AuthController, UserController]
  })

  // Configure cookie parser and handle JSON cookies
  app.use(cookieParser('RavenAndJonahRule'))
  app.use((req, res, next) => {
    req.cookies = cookieParser.JSONCookies(req.cookies)
    next()
  })

  // Parse JSON bodies
  app.use(bodyParser.json())

  // Use routing-controllers to add controllers to the app
  useExpressServer(app, {
    cors: corsOptions,
    controllers: [WeaponController, MapController, ClassController, AuthController, UserController]
  })

  // Handle 404 errors
  app.use(function (req, res, next) {
    next(createError(404))
  })

  // Handle general errors
  app.use(function (err, req, res, next) {
    if (!res._headerSent) {
      res.status(err.status || 500)
      res.json({ status: err.status, message: err.message, stack: err.stack.split(/\s{4,}/) })
    }
  })

  // Configure Steam authentication strategy for Passport
  passport.use(new SteamStrategy({
    returnURL: 'http://localhost:3004/auth/steam/return',
    realm: 'http://localhost:3004/',
    apiKey: 'A5C43134FAA40E4B2F301226D0E62065'
  },
  function (identifier, profile, done) {
    console.log('we here')
    console.log(profile)
    const userController = new UserController()
    userController.findOrCreate(profile.id, {
      username: profile.displayName,
      steamId: profile.id,
      avatarUrl: profile.photos[2].value
    }).then(user => {
      // Use the done function to redirect the user
      return done(null, user, { redirectTo: 'http://localhost:8080/?haha' })
    }).catch(err => {
      return done(err)
    })
  }))

  // Start the Express app on port 3004
  app.listen(3004)

  console.log('Express server has started on port 3004. Open http://localhost:3004/weapons to see results')
}).catch(error => console.log(error))
