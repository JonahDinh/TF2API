import { Request, Response } from 'express'
import { Map } from '../entity/Map'
import { validate, ValidatorOptions } from 'class-validator'
import { AppDataSource } from '../data-source'
import { Body, Delete, Get, JsonController, Param, Post, Put, Req, Res } from 'routing-controllers'
import { User } from '../entity/Users'

// Controller for handling operations related to maps
@JsonController()
export default class StudentController {
  private readonly mapRepo = AppDataSource.getRepository(Map)
  private readonly userRepo = AppDataSource.getRepository(User)

  // Validation options for class-validator
  private readonly validOptions: ValidatorOptions = {
    stopAtFirstError: true,
    skipMissingProperties: false,
    validationError: { target: false, value: false }
  }

  // Retrieve maps based on ID or apply sorting and return all maps
  @Get('/maps/:id*?')
  async read (@Req() req: Request, @Res() res: Response) {
    if (req.params.id) return await this.mapRepo.findOne({ where: { id: req.params.id } })
    else {
      // Prepare options for finding maps with sorting
      const findOptions: any = { order: {}, where: [] }
      const existingFields = this.mapRepo.metadata.ownColumns.map((col) => col.propertyName)
      const sortField: string = existingFields.includes(req.query.sortby) ? req.query.sortby : 'id'
      findOptions.order[sortField] = req.query.reverse ? 'DESC' : 'ASC'

      return await this.mapRepo.find(findOptions)
    }
  }

  // Delete a map based on ID
  @Delete('/maps/:id')
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

    // Find map to remove and handle deletion
    const mapToRemove = await this.mapRepo.findOne({ where: { id: req.params.id } })
    if (!mapToRemove) {
      return res.status(404).send('Map not found')
    }
    await this.mapRepo.remove(mapToRemove)
    return res.status(204).send() // Send response for successful deletion
  }

  // Update a map based on ID
  @Put('/maps/:id')
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

    // Preload the map data for updating
    const mapToUpdate = await this.mapRepo.preload(reqBody)

    // Extra validation - ensure the ID param matched the ID submitted in the body
    if (!mapToUpdate || mapToUpdate.id !== id) {
      // Send a 404 error if the map is not found or IDs don't match
      return res.status(404).send('Map not found')
    } else {
      // Validate the map data and save if validation passes
      const violations = await validate(mapToUpdate, this.validOptions)
      if (violations.length) {
        res.statusCode = 422 // Unprocessable Entity
        return violations
      } else {
        return await this.mapRepo.save(mapToUpdate)
      }
    }
  }

  // Create a new map
  @Post('/maps')
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

    // Create a new map and validate the data
    const mapToCreate = Object.assign(new Map(), reqBody)
    const violations = await validate(mapToCreate, this.validOptions)

    if (violations.length) {
      res.statusCode = 422 // Unprocessable Entity
      return violations
    } else {
      return await this.mapRepo.save(mapToCreate)
    }
  }
}
