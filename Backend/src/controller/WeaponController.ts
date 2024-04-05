import { Request, Response } from 'express'
import { Weapon } from '../entity/Weapon'
import { validate, ValidatorOptions } from 'class-validator'
import { AppDataSource } from '../data-source'
import { Body, Delete, Get, JsonController, Param, Post, Put, Req, Res } from 'routing-controllers'
import { User } from '../entity/Users'

// Controller for handling operations related to weapons
@JsonController()
export default class WeaponController {
  private readonly weaponRepo = AppDataSource.getRepository(Weapon)
  private readonly userRepo = AppDataSource.getRepository(User)

  // Validation options for class-validator
  private readonly validOptions: ValidatorOptions = {
    stopAtFirstError: true,
    skipMissingProperties: false,
    validationError: { target: false, value: false }
  }

  // Retrieve weapons based on ID or apply sorting and return all weapons
  @Get('/weapons/:id*?')
  async read (@Req() req: Request, @Res() res: Response) {
    if (req.params.id) return await this.weaponRepo.findOne({ where: { id: req.params.id } })
    else {
      // Prepare options for finding weapons with sorting
      const findOptions: any = { order: {}, where: [] }
      const existingFields = this.weaponRepo.metadata.ownColumns.map((col) => col.propertyName)
      const sortField: string = existingFields.includes(req.query.sortby) ? req.query.sortby : 'id'
      findOptions.order[sortField] = req.query.reverse ? 'DESC' : 'ASC'

      return await this.weaponRepo.find(findOptions)
    }
  }

  // Delete a weapon based on ID
  @Delete('/weapons/:id')
  async delete (@Req() req: Request, @Res() res: Response) {
    // Extract Steam ID from authorization header
    const steamIdToken = req.headers.authorization
    if (!steamIdToken || !steamIdToken.startsWith('Bearer ')) {
      return res.status(401).send('Unauthorized')
    }
    const steamId = steamIdToken.split(' ')[1]

    // Find user based on Steam ID
    const user = await this.userRepo.findOne({ where: { steamId } })
    if (!user) {
      return res.status(401).send('Unauthorized: User not found')
    }

    // Find weapon to remove and handle deletion
    const weaponToRemove = await this.weaponRepo.findOne({ where: { id: req.params.id } })
    if (!weaponToRemove) {
      return res.status(404).send('Weapon not found')
    }
    await this.weaponRepo.remove(weaponToRemove)
    return res.status(204).send() // Send response for successful deletion
  }

  // Update a weapon based on ID
  @Put('/weapons/:id')
  async update (@Body() reqBody: Request, @Param('id') id: number, @Req() req: Request, @Res() res: Response) {
    // Extract Steam ID from authorization header
    const steamIdToken = req.headers.authorization
    if (!steamIdToken || !steamIdToken.startsWith('Bearer ')) {
      return res.status(401).send('Unauthorized')
    }
    const steamId = steamIdToken.split(' ')[1]

    // Find user based on Steam ID
    const user = await this.userRepo.findOne({ where: { steamId } })
    if (!user) {
      return res.status(401).send('Unauthorized: User not found')
    }

    // Preload the weapon data for updating
    const weaponToUpdate = await this.weaponRepo.preload(reqBody)

    // Extra validation - ensure the ID param matched the ID submitted in the body
    if (!weaponToUpdate || weaponToUpdate.id !== id) {
      // Send a 404 error if the weapon is not found or IDs don't match
      return res.status(404).send('Weapon not found')
    } else {
      // Validate the weapon data and save if validation passes
      const violations = await validate(weaponToUpdate, this.validOptions)
      if (violations.length) {
        res.statusCode = 422 // Unprocessable Entity
        return violations
      } else {
        return await this.weaponRepo.save(weaponToUpdate)
      }
    }
  }

  // Create a new weapon
  @Post('/weapons')
  async create (@Body() reqBody: any, @Req() req: Request, @Res() res: Response) {
    // Extract Steam ID from authorization header
    const steamIdToken = req.headers.authorization
    if (!steamIdToken || !steamIdToken.startsWith('Bearer ')) {
      return res.status(401).send('Unauthorized')
    }
    const steamId = steamIdToken.split(' ')[1]

    // Find user based on Steam ID
    const user = await this.userRepo.findOne({ where: { steamId } })
    if (!user) {
      return res.status(401).send('Unauthorized: User not found')
    }

    // Create a new weapon and validate the data
    const weaponToCreate = Object.assign(new Weapon(), reqBody)
    const violations = await validate(weaponToCreate, this.validOptions)

    if (violations.length) {
      res.statusCode = 422 // Unprocessable Entity
      return violations
    } else {
      return await this.weaponRepo.save(weaponToCreate)
    }
  }
}
