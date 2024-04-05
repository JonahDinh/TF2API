import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm'
import { IsNotEmpty, Length } from 'class-validator'

@Entity()
export class Map {
  @PrimaryGeneratedColumn()
    id: number

  @Column({ type: 'varchar', length: 100, nullable: false })
  @Length(1, 100, { message: 'Name must be from $constraint1 to $constraint2 characters' })
  @IsNotEmpty({ message: 'Name is Required' })
    name: string

  @Column({ type: 'varchar', length: 50, nullable: false })
  @Length(1, 50, { message: 'Category must be between $constraint1 and $constraint2 characters' })
  @IsNotEmpty({ message: 'Category is required' })
    type: string

  @Column({ type: 'varchar', length: 50, nullable: false })
  @Length(1, 50, { message: 'Category must be between $constraint1 and $constraint2 characters' })
  @IsNotEmpty({ message: 'Category is required' })
    setting: string
}
