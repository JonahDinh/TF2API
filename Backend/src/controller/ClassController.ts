/* eslint-disable no-mixed-spaces-and-tabs */
import { Request, Response } from 'express'
import { Class } from '../entity/Class'
import { validate, ValidatorOptions } from 'class-validator'
import { AppDataSource } from '../data-source'
import { Body, Delete, Get, JsonController, Param, Post, Put, Req, Res } from 'routing-controllers'
import { User } from '../entity/Users'

@JsonController()
export default class StudentController {
  // Repositories for Class and User entities
  private readonly classRepo = AppDataSource.getRepository(Class)
  private readonly userRepo = AppDataSource.getRepository(User)
  // Validator options for class-validator package
  private readonly validOptions: ValidatorOptions = {
    stopAtFirstError: true,
    skipMissingProperties: false,
    validationError: { target: false, value: false }
  }

  // Handle read operation for classes
  @Get('/classes/:id*?')
  async read (@Req() req: Request, @Res() res: Response) {
    if (req.params.id) return await this.classRepo.findOne({ where: { id: req.params.id } })
    else {
      // Prepare options for find operation (sorting)
      const findOptions: any = { order: {}, where: [] }
      const existingFields = this.classRepo.metadata.ownColumns.map((col) => col.propertyName)
      const sortField: string = existingFields.includes(req.query.sortby) ? req.query.sortby : 'id'
      findOptions.order[sortField] = req.query.reverse ? 'DESC' : 'ASC'

      return await this.classRepo.find(findOptions)
    }
  }

  // Handle delete operation for classes
  @Delete('/classes/:id')
  async delete (@Req() req: Request, @Res() res: Response) {
    // Extract Steam ID from authorization header
    const steamIdToken = req.headers.authorization
    if (!steamIdToken || !steamIdToken.startsWith('Bearer ')) {
      return res.status(401).send('Unauthorized')
    }
    const steamId = steamIdToken.split(' ')[1]
    // Check if user with the Steam ID exists
    const user = await this.userRepo.findOne({ where: { steamId } })
    if (!user) {
      return res.status(401).send('Unauthorized: User not found')
    }
    // Find and delete the specified class
    const classToRemove = await this.classRepo.findOne({ where: { id: req.params.id } })
    if (!classToRemove) {
      return res.status(404).send('Class not found')
    }
    await this.classRepo.remove(classToRemove)
    return res.status(204).send() // Send response for successful deletion
  }

  // Handle update operation for classes
  @Put('/classes/:id')
  async update (@Body() reqBody: Request, @Param('id') id: number, @Req() req: Request, @Res() res: Response) {
    // Preload the class data from the request body
    const classToUpdate = await this.classRepo.preload(reqBody)
    const authorizationHeader = req.headers.authorization

    // Check for authorization
    if (!authorizationHeader || !authorizationHeader.startsWith('Bearer ForErnesto')) {
      return res.status(401).send('Unauthorized')
    }

    // Extra validation - ensure the id param matched the id submitted in the body
    if (!classToUpdate || classToUpdate.id !== id) {
      // Send a 404 error if the class is not found or IDs don't match
      return res.status(404).send('Class not found')
    } else {
      // Validate the updated class data
      const violations = await validate(classToUpdate, this.validOptions)
      if (violations.length) {
        res.statusCode = 422 // Unprocessable Entity
        return violations
      } else {
        // Save the updated class data
        return await this.classRepo.save(classToUpdate)
      }
    }
  }

  // Handle create operation for classes
  @Post('/classes')
  async create (@Body() reqBody: any, @Req() req: Request, @Res() res: Response) {
    const steamIdToken = req.headers.authorization

    // Check for authorization
    if (!steamIdToken || !steamIdToken.startsWith('Bearer ')) {
      return res.status(401).send('Unauthorized')
    }

    // Extract Steam ID from the token
    const steamId = steamIdToken.split(' ')[1]

    // Check if user with the Steam ID exists
    const user = await this.userRepo.findOne({ where: { steamId } })

    if (!user) {
      return res.status(401).send('Unauthorized: User not found')
    }

    // Create a new class instance with the provided data
    const classToCreate = Object.assign(new Class(), reqBody)

    // Validate the new class data
    const violations = await validate(classToCreate, this.validOptions)

    if (violations.length) {
      res.statusCode = 422 // Unprocessable Entity
      return violations
    } else {
      // Save the new class data
      return await this.classRepo.save(classToCreate)
    }
  }
}
