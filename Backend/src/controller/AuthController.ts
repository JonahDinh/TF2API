import { Get, JsonController, Req, Res, UseBefore } from 'routing-controllers'
import * as passport from 'passport'
import { Request, Response } from 'express'

@JsonController()
export class AuthController {
  @Get('/auth/steam')
  @UseBefore(passport.authenticate('steam', { failureRedirect: '/' }))
  authSteam (@Req() reqBody: Request, @Res() res: Response) {
    console.log('Received request for Steam authentication start')
    res.redirect('/maps')
  }

  @Get('/auth/steam/return')
  @UseBefore(passport.authenticate('steam', { failureRedirect: '/' }))
  authSteamReturn (@Req() reqBody: Request, @Res() res: Response) {
    console.log('Received request for Steam authentication return')
    res.redirect('/classes')
  }
}
