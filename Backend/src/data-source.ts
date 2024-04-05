import 'reflect-metadata'
import { DataSource } from 'typeorm'
import { Map } from './entity/Map'
import { Weapon } from './entity/Weapon'
import { Class } from './entity/Class'
import { User } from './entity/Users'
export const AppDataSource = new DataSource({
  type: 'better-sqlite3',
  database: 'sqlite.db',
  synchronize: true,
  logging: false,
  entities: [Map, Class, Weapon, User],
  migrations: [],
  subscribers: []
})
