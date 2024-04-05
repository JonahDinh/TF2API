import { AppDataSource } from '../data-source'
import { User } from '../entity/Users'
import { ValidatorOptions } from 'class-validator'
import { Get, JsonController, Req, Res } from 'routing-controllers'
import { Request, Response } from 'express'

@JsonController()
export default class UserController {
  private readonly userRepo = AppDataSource.getRepository(User)
  private readonly validOptions: ValidatorOptions = {
    stopAtFirstError: true,
    skipMissingProperties: false,
    validationError: { target: false, value: false }
  }

  async findOrCreate (steamId: string, userData: Partial<User>): Promise<User> {
    console.log('Finding or creating user with Steam ID:', steamId)
    let user = await this.userRepo.findOne({ where: { steamId } })
    if (!user) {
      console.log('User not found. Creating new user with data:', userData)
      user = this.userRepo.create(userData)
      try {
        await this.userRepo.save(user)
        console.log('New user created:', user)
      } catch (error) {
        console.error('Error saving user:', error)
      }
    } else {
      console.log('User found:', user)
    }
    return user
  }

  @Get('/user/:steamId*?')
  async read (@Req() req: Request, @Res() res: Response) {
    const bearerValidate = req.headers.authorization
    if (!bearerValidate || !bearerValidate.startsWith('Bearer TrustMeImTheFrontEndBro')) {
      return res.status(401).send('Unauthorized')
    }
    if (req.params.steamId) return await this.userRepo.findOne({ where: { steamId: req.params.steamId } })
    else {
      // Prepare options for finding weapons with sorting
      const findOptions: any = { order: {}, where: [] }
      const existingFields = this.userRepo.metadata.ownColumns.map((col) => col.propertyName)
      const sortField: string = existingFields.includes(req.query.sortby) ? req.query.sortby : 'id'
      findOptions.order[sortField] = req.query.reverse ? 'DESC' : 'ASC'
    }
  }
}
